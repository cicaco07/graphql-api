import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNavigationInput, NavigationType } from './dto/navigation.dto';
import { UpdateNavigationInput } from './dto/update-navigation.input';
import { Navigation, NavigationDocument } from './schemas/navigation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NavigationService {
  constructor(
    @InjectModel(Navigation.name) private navigationModel: Model<Navigation>,
  ) {}

  async createNavigation(
    createNavigationInput: CreateNavigationInput,
  ): Promise<NavigationType> {
    try {
      if (createNavigationInput.parent_id) {
        const parent = await this.navigationModel.findById(
          createNavigationInput.parent_id,
        );
        if (!parent) {
          throw new NotFoundException(
            `Parent navigation with id ${createNavigationInput.parent_id} not found`,
          );
        }
      }

      const navigation = new this.navigationModel(createNavigationInput);
      const savedNavigation = await navigation.save();
      return this.formatNavigationResponse(savedNavigation);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to create navigation');
    }
  }

  async getAllNavigations(): Promise<NavigationType[]> {
    const navigations = await this.navigationModel.find().sort({ order: 1 });
    return navigations.map((navigation) =>
      this.formatNavigationResponse(navigation),
    );
  }

  async getNavigationById(id: string): Promise<NavigationType> {
    const navigation = await this.navigationModel.findById(id);
    if (!navigation) {
      throw new NotFoundException(`Navigation with id ${id} not found`);
    }
    return this.formatNavigationResponse(navigation);
  }

  async getNavigationsByRole(userRoles: string[]): Promise<NavigationType[]> {
    const navigations = await this.navigationModel
      .find({
        is_active: true,
        is_visible: true,
        roles: { $in: userRoles },
      })
      .sort({ order: 1 });

    return this.buildNavigationTree(
      navigations.map((navigation) =>
        this.formatNavigationResponse(navigation),
      ),
    );
  }

  async getNavigationsByRoleAndPermissions(
    userRoles: string[],
    userPermissions: string[],
  ): Promise<NavigationType[]> {
    const navigations = await this.navigationModel
      .find({
        is_active: true,
        is_visible: true,
        $or: [
          { roles: { $in: userRoles } },
          { permissions: { $in: userPermissions } },
        ],
      })
      .sort({ order: 1 });

    return this.buildNavigationTree(
      navigations.map((navigation) =>
        this.formatNavigationResponse(navigation),
      ),
    );
  }

  async getNavigationTree(): Promise<NavigationType[]> {
    const navigations = await this.navigationModel
      .find({ is_active: true })
      .sort({ order: 1 });
    return this.buildNavigationTree(
      navigations.map((navigation) =>
        this.formatNavigationResponse(navigation),
      ),
    );
  }

  private buildNavigationTree(navigations: NavigationType[]): NavigationType[] {
    const navigationMap = new Map<string, NavigationType>();
    const rootNavigations: NavigationType[] = [];

    navigations.forEach((navigation) => {
      navigationMap.set(navigation._id, { ...navigation, children: [] });
    });

    // Build the tree structure
    navigations.forEach((navigation) => {
      const navigationItem = navigationMap.get(navigation._id);
      if (!navigationItem) return;

      if (navigation.parent_id && navigationMap.has(navigation.parent_id)) {
        const parent = navigationMap.get(navigation.parent_id);
        if (!parent) return;

        if (parent.children) {
          parent.children.push(navigationItem);
        } else {
          parent.children = [navigationItem];
        }
      } else {
        rootNavigations.push(navigationItem);
      }
    });

    return rootNavigations;
  }

  async updateNavigation(
    updateNavigationInput: UpdateNavigationInput,
  ): Promise<NavigationType> {
    try {
      const { _id, ...updateData } = updateNavigationInput;

      if (updateData.parent_id) {
        const parent = await this.navigationModel.findById(
          updateData.parent_id,
        );
        if (!parent) {
          throw new NotFoundException('Parent navigation not found');
        }
      }

      const updatedNavigation = await this.navigationModel.findByIdAndUpdate(
        _id,
        updateData,
        { new: true, runValidators: true },
      );

      if (!updatedNavigation) {
        throw new NotFoundException('Navigation not found');
      }

      return this.formatNavigationResponse(updatedNavigation);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update navigation');
    }
  }

  async removeNavigation(id: string): Promise<boolean> {
    try {
      const hasChildren = await this.navigationModel.findOne({ parent_id: id });
      if (hasChildren) {
        throw new BadRequestException('Cannot delete navigation with children');
      }

      const result = await this.navigationModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete navigation');
    }
  }

  private formatNavigationResponse(
    navigation: NavigationDocument,
  ): NavigationType {
    return {
      _id: (navigation._id as string).toString(),
      name: navigation.name,
      parent_id: navigation.parent_id?.toString() || '',
      icon: navigation.icon || '',
      route: navigation.route || '',
      is_header: navigation.is_header,
      is_active: navigation.is_active,
      order: navigation.order,
      roles: navigation.roles,
      permissions: navigation.permission,
      description: navigation.description || '',
      level: navigation.level,
      component: navigation.component || '',
      is_visible: navigation.is_visible,
      createdAt: navigation.createdAt,
      updatedAt: navigation.updatedAt,
    };
  }

  async seedNavigations(): Promise<void> {
    const existingNavigations = await this.navigationModel.countDocuments();
    if (existingNavigations > 0) return;

    const navigationData = [
      // Super Admin Menus
      {
        name: 'Dashboard',
        icon: 'dashboard',
        route: '/dashboard',
        order: 1,
        roles: ['super_admin', 'admin', 'user'],
        is_header: false,
      },
      {
        name: 'User Management',
        icon: 'users',
        route: null,
        order: 2,
        roles: ['super_admin'],
        is_header: true,
      },
      {
        name: 'Menu Management',
        icon: 'menu',
        route: null,
        order: 3,
        roles: ['super_admin'],
        is_header: true,
      },

      // Data Management (for all roles)
      {
        name: 'Data Management',
        icon: 'database',
        route: null,
        order: 4,
        roles: ['super_admin', 'admin', 'user'],
        is_header: true,
      },
    ];

    await this.navigationModel.insertMany(navigationData);

    // Get created navigations for creating children
    const createdNavigations = await this.navigationModel.find();
    const userMgmt = createdNavigations.find(
      (m) => m.name === 'User Management',
    );
    const menuMgmt = createdNavigations.find(
      (m) => m.name === 'Menu Management',
    );
    const dataMgmt = createdNavigations.find(
      (m) => m.name === 'Data Management',
    );

    if (!userMgmt || !menuMgmt || !dataMgmt) {
      throw new BadRequestException('Failed to create parent navigations');
    }

    const childNavigations = [
      // User Management Children
      {
        name: 'Users',
        parent_id: userMgmt._id,
        icon: 'user',
        route: '/users',
        order: 1,
        roles: ['super_admin'],
        is_header: false,
      },
      {
        name: 'Roles',
        parent_id: userMgmt._id,
        icon: 'shield',
        route: '/roles',
        order: 2,
        roles: ['super_admin'],
        is_header: false,
      },

      // Menu Management Children
      {
        name: 'Menus',
        parent_id: menuMgmt._id,
        icon: 'list',
        route: '/menus',
        order: 1,
        roles: ['super_admin'],
        is_header: false,
      },
      {
        name: 'Permissions',
        parent_id: menuMgmt._id,
        icon: 'key',
        route: '/permissions',
        order: 2,
        roles: ['super_admin'],
        is_header: false,
      },

      // Data Management Children
      {
        name: 'Hero',
        parent_id: dataMgmt._id,
        icon: 'star',
        route: '/heroes',
        order: 1,
        roles: ['super_admin', 'admin', 'user'],
        is_header: false,
      },
      {
        name: 'Skills',
        parent_id: dataMgmt._id,
        icon: 'zap',
        route: '/skills',
        order: 2,
        roles: ['super_admin', 'admin'],
        is_header: false,
      },
      {
        name: 'Base Stats',
        parent_id: dataMgmt._id,
        icon: 'bar-chart',
        route: '/base-stats',
        order: 3,
        roles: ['super_admin', 'admin'],
        is_header: false,
      },
    ];

    await this.navigationModel.insertMany(childNavigations);
  }
}
