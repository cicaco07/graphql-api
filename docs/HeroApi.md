# **Hero Api Documentation**

## Hero API Table of Contents
1. [Create Hero API](#1-create-hero-api)
2. [Create Hero with Skill & Skill Detail API](#2-create-hero-with-skill--skill-detail-api)
3. [Find All Hero API](#3-find-all-hero-api)
4. [Find All Hero with Skill & Skill Detail API](#4-find-all-hero-with-skill--skill-detail-api)
5. [Find Hero By ID API](#5-find-hero-by-id-api)
6. [Find Hero By Name API](#6-find-hero-by-name-api)
7. [Update Hero API](#7-update-hero-api)
8. [Delete Hero API](#8-delete-hero-api)

## 1. Create Hero API
Description: This mutation allows you to create a new hero with basic attributes such as name, alias, role, type, avatar, image, short description, release date, and various stats like durability, offense, control effect, and difficulty. You can return the created hero's ID and other attributes based on your needs.
### Example schema field for Create Hero
```
mutation {
  createHero(
    input: {
      name: string
      alias: string
      role: string[]
      type: string[]
      avatar: string
      image: string
      short_description: string
      release_date: Date
      durability: number
      offense: number
      control_effect: number
      difficulty: number
    }
  ) {
    _id
    name
    alias
    role
    // etc...
  }
}
```
### Example mutation for Create Hero
```
mutation {
  createHero(
    input: {
      name: "Alice",
      alias: "Queen of Blood",
      role: ["Explane", "Jungle"],
      type: ["Mage", "Tank"],
      avatar: "https://akmweb.youngjoygame.com/web/svnres/img/mlbb/homepage/100_558cf35ad7d5f0cc4f0b4cbdf9498f9f.png",
      image: "https://akmweb.youngjoygame.com/web/svnres/img/mlbb/homepage/100_e7f782918c687ed9c06e76f297814d58.png",
      short_description: "Ratu Blood Demon yang licik dan jahat",
      realese_date: "2016-07-14",
      durability: 50,
      offense: 50,
      control_effect: 70,
      difficulty: 70,
    }
  ) {
    _id
    name
    alias
    role
    // etc...
  }
}
```
### Example response for Create Hero
```json
"data": {
  "createHero": {
    "_id": "60c72b2f9b1e8c001c0a1b2c",
    "name": "Alice",
    "alias": "Queen of Blood",
    "role": ["Explane", "Jungle"],
    "type": ["Mage", "Tank"],
    // etc ...
  }
}
```
## 2. Create Hero with Skill & Skill Detail API
Description: This mutation allows you to create a new hero with skills and skill details. Each skill can have attributes like name, type, tag, attack effect, skill icon, lite description, full description, and an array of skill details that include level and attributes. You can return the created hero's ID and other attributes based on your needs.
### Example schema field for Create Hero with Skill & Skill Detail
```
mutation {
  createHero(
    input: {
      name: string
      alias: string
      role: string[]
      type: string[]
      avatar: string
      image: string
      short_description: string
      release_date: Date
      durability: number
      offense: number
      control_effect: number
      difficulty: number
      skills: Skill[
        name: string
        type: string
        tag: string[]
        attack_effect?: number
        skill_icon: string
        lite_description: string
        full_description: string
        skills_detail?: SkillDetail[
          level?: number
          attributes?: Record<string, any>
        ]
      ]
    }
  ) {
    _id
    name
    alias
    skills {
      _id
      name
      type
      skills_detail {
        _id
        level
        attributes
      }
    }
  }
}
```
### Example mutation for Create Hero with Skill & Skill Detail
```
mutation {
  createHero(
    input: {
      name: "Alice",
      alias: "Queen of Blood",
      role: ["Explane", "Jungle"],
      type: ["Mage", "Tank"],
      avatar: "https://akmweb.youngjoygame.com/web/svnres/img/mlbb/homepage/100_558cf35ad7d5f0cc4f0b4cbdf9498f9f.png",
      image: "https://akmweb.youngjoygame.com/web/svnres/img/mlbb/homepage/100_e7f782918c687ed9c06e76f297814d58.png",
      short_description: "Ratu Blood Demon yang licik dan jahat",
      release_date: "2016-07-14",
      durability: 50,
      offense: 50,
      control_effect: 70,
      difficulty: 70,
      skills: [
        {
          name: "Blood Ancestry",
          type: "Passive",
          tag: ["Buff"],
          skill_icon: "https://akmweb.youngjoygame.com/web/svnres/img/mlbb/homepage/100_d4efd4dc88ba1f3ab47c15e1b57abdaa.png",
          lite_description: "Alice possesses higher Mana Regen, and her Movement Speed and Healing Receiver increase with her level.",
          full_description: "Alice memulihkan 3% Max Mana setiap detik. Setiap kali level Alice naik, dia meningkatkan 3 Movement Speed-nya dan 1% Pemulihan yang Diterima.",
          skills_detail: []
        },
        {
          name: "Flowing Blood",
          type: "Skill 1",
          tag: ["Blink", "Area Efek"],
          skill_icon: "https://akmweb.youngjoygame.com/web/svnres/img/mlbb/homepage/100_49c3d7488b80adf5e638636baf7b477c.png",
          lite_description: "",
          full_description: "Alice mengeluarkan gumpalan darah ke arah target, memberikan {{base_damage}} (+120% Total Magic Power) Magic Damage ke lawan di jalurnya.",
          skills_detail: [
            {
              level: 1,
              attributes: {
                mana_cost: 50,
                base_damage: 400,
              }
            },
            {
              level: 2,
              attributes: {
                mana_cost: 55,
                base_damage: 440,
              }
            },
            {
              level: 3,
              attributes: {
                mana_cost: 60,
                base_damage: 480,
              }
            },
            {
              level: 4,
              attributes: {
                mana_cost: 65,
                base_damage: 520,
              }
            },
            {
              level: 5,
              attributes: {
                mana_cost: 70,
                base_damage: 560,
              }
            },
            {
              level: 6,
              attributes: {
                mana_cost: 75,
                base_damage: 600,
              }
            },
          ]
        },
      ]
    }
  )
}
```
### Example response for Create Hero with Skill & Skill Detail
```json
"data": {
  "createHero": {
    "_id": "60c72b2f9b1e8c001c0a1b2c",
    "name": "Alice",
    "alias": "Queen of Blood",
    "skills": [
      {
        "_id": "60c72b2f9b1e8c001c0a1b2d",
        "name": "Blood Ancestry",
        "type": "Passive",
        "skills_detail": []
      },
      {
        "_id": "60c72b2f9b1e8c001c0a1b2e",
        "name": "Flowing Blood",
        "type": "Skill 1",
        "skills_detail": [
          {
            "_id": "60c72b2f9b1e8c001c0a1b2f",
            "level": 1,
            "attributes": {
              "mana_cost": 50,
              "base_damage": 400
            }
          },  
        ]
      }
    ]
  }
}
```
## 3. Find All Hero API
Description: This query retrieves all heroes from the database, including their ID, name, alias, role, type, and other attributes. You can customize the fields you want to retrieve based on your needs. 
### Example query for Find All Hero
```
query {
  heroes {
    _id
    name
    alias
    role
    type
    // etc...
  }
}
```
### Example response for Find All Hero
```json
"data": {
  "heroes": [
    {
      "_id": "60c72b2f9b1e8c001c0a1b2c",
      "name": "Alice",
      "alias": "Queen of Blood",
      "role": ["Explane", "Jungle"],
      "type": ["Mage", "Tank"],
      // etc ...
    }
  ]
}
```
## 4. Find All Hero with Skill & Skill Detail API
Description: This query retrieves all heroes along with their skills and skill details. Each skill can have attributes like name, type, tag, attack effect, skill icon, lite description, full description, and an array of skill details that include level and attributes. You can customize the fields you want to retrieve based on your needs.
### Example query for Find All Hero with Skill & Skill Detail
```
query {
  heroes {
    _id
    name
    alias
    skills {
      _id
      name
      type
      skills_detail {
        _id
        level
        attributes
      }
    }
  }
}
```
### Example response for Find All Hero with Skill & Skill Detail
```json
"data": {
  "heroes": [
    {
      "_id": "60c72b2f9b1e8c001c0a1b2c",
      "name": "Alice",
      "alias": "Queen of Blood",
      "skills": [
        {
          "_id": "60c72b2f9b1e8c001c0a1b2d",
          "name": "Blood Ancestry",
          "type": "Passive",
          "skills_detail": []
        },
        {
          "_id": "60c72b2f9b1e8c001c0a1b2e",
          "name": "Flowing Blood",
          "type": "Skill 1",
          "skills_detail": [
            {
              "_id": "60c72b2f9b1e8c001c0a1b2f",
              "level": 1,
              "attributes": {
                "mana_cost": 50,
                "base_damage": 400
              }
            },
            {
              "_id": "60c72b2f9b1e8c001c0a1b30",
              "level": 2,
              "attributes": {   
                "mana_cost": 55,
                "base_damage": 440
              }
            },
          ]
        },
      ]
    }
  ]
}
```

## 5. Find Hero By ID API
Description: This query retrieves a specific hero by their ID, including their ID, name, alias, role, type, and other attributes. You can customize the fields you want to retrieve based on your needs.
### Example query for Find Hero By ID
```
query {
  hero(id: string) {
    _id
    name
    alias
    role
    // etc...
  }
}
```
### Example response for Find Hero By ID
```json
"data": {
  "hero": {
    "_id": "60c72b2f9b1e8c001c0a1b2c",
    "name": "Alice",
    "alias": "Queen of Blood",
    "role": ["Explane", "Jungle"],
    "type": ["Mage", "Tank"],
    // etc...
  }
}
```
## 6. Find Hero By Name API
Description: This query retrieves a specific hero by their name, including their ID, name, alias, role, type, and other attributes. You can customize the fields you want to retrieve based on your needs.
### Example query for Find Hero By ID
```
query {
  heroByName(name: string) {
    _id
    name
    alias
    role
    type
    // etc...
  }
}
```
### Example response for Find Hero By ID
```json
"data": {
  "heroByName": {
    "_id": "60c72b2f9b1e8c001c0a1b2c",
    "name": "Alice",
    "alias": "Queen of Blood",
    "role": ["Explane", "Jungle"],
    "type": ["Mage", "Tank"],
    // etc...
  }
}
```
## 7. Update Hero API
Description: This mutation allows you to update an existing hero's attributes such as name, alias, role, type, and other fields. You can specify the hero by their ID and return the updated hero's ID and other attributes based on your needs.
### Example mutation for Update Hero
```
mutation {
  updateHero(
    id: string,
    input: {
      name: string
      alias: string
      role: string[]
      type: string[]
      // etc...
    }
  ) {
    _id
    name
    alias
    role
    // etc...
  }
}
```
### Example mutation for Update Hero with Skill & Skill Detail
```
mutation {
  updateHero(
    id: "60c72b2f9b1e8c001c0a1b2c",
    input: {
      name: "Alice Baru",
      alias: "Queen of Blood",
      role: ["Explane", "Jungle"],
      type: ["Mage", "Tank"],
      // etc...
    }
  )
}
```
### Example response for Update Hero
```json
"data": {
  "updateHero": {
    "_id": "60c72b2f9b1e8c001c0a1b2c",
    "name": "Alice Baru",
    "alias": "Queen of Blood",
    "role": ["Explane", "Jungle"],
    "type": ["Mage", "Tank"],
    // etc ...
  }
}
```
## 8. Delete Hero
Description: This mutation allows you to delete an existing hero by their ID. You can return the deleted hero's ID and name based on your needs.
### Example mutation for Delete Hero
```
mutation {
  removeHero(
    id: string
  ) {
    _id
    name
  }
}
```
### Example response for Delete Hero
```json
"data": {
  "removeHero": {
    "_id": "60c72b2f9b1e8c001c0a1b2c",
    "name": "Alice"
  }
}
```