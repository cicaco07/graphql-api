# **Battle Spell API Documentation**

## Battle Spell API Table of Contents

- [**Battle Spell API Documentation**](#battle-spell-api-documentation)
  - [Battle Spell API Table of Contents](#battle-spell-api-table-of-contents)
  - [1. Create Battle Spell API](#1-create-battle-spell-api)
    - [- Example schema field for Create Battle Spell API](#--example-schema-field-for-create-battle-spell-api)
    - [- Example mutation for Create Battle Spell API](#--example-mutation-for-create-battle-spell-api)
    - [- Example response for Create Battle Spell API](#--example-response-for-create-battle-spell-api)
  - [2. Get All Battle Spell API](#2-get-all-battle-spell-api)
    - [- Example query for Get All Battle Spell API](#--example-query-for-get-all-battle-spell-api)
    - [- Example response for Get All Battle Spell API](#--example-response-for-get-all-battle-spell-api)
  - [3. Get Battle Spell By Id API](#3-get-battle-spell-by-id-api)
    - [- Example query for Get Battle Spell By Id API](#--example-query-for-get-battle-spell-by-id-api)
    - [- Example response for Get Battle Spell By Id API](#--example-response-for-get-battle-spell-by-id-api)
  - [4. Update Battle Spell API](#4-update-battle-spell-api)
    - [- Example schema field for Update Battle Spell API](#--example-schema-field-for-update-battle-spell-api)
    - [- Example mutation for Update Battle Spell API](#--example-mutation-for-update-battle-spell-api)
    - [- Example response for Update Battle Spell API](#--example-response-for-update-battle-spell-api)
  - [5. Remove Battle Spell API](#5-remove-battle-spell-api)
    - [- Example schema field for Remove Battle Spell API](#--example-schema-field-for-remove-battle-spell-api)
    - [- Example mutation for Remove Battle Spell API](#--example-mutation-for-remove-battle-spell-api)
    - [- Example response for Remove Battle Spell API](#--example-response-for-remove-battle-spell-api)

## 1. Create Battle Spell API

Description: This mutation allows you to create a new battle spell with attributes such as name, tag, cooldown, icon and description. You can return the created battle spell object in the response.

### - Example schema field for Create Battle Spell API

```
mutation {
  createBattleSpell(
    createBattleSpellInput: {
      name: string
      tag: string
      cooldown: number
      icon: string
      description: string
    }
  ) {
    id
    name
    tag
    cooldown
    icon
    description
  }
}
```

- HTTP Headers:

```js
Authorization: Bearer <access_token>
```

### - Example mutation for Create Battle Spell API

```
mutation {
  createBattleSpell(
    createBattleSpellInput: {
      name: "Flicker",
      tag: "Berpindah secara cepat",
      cooldown: 120,
      icon: "flicker.png",
      description: "A spell that allows the caster to quickly reposition."
    }
  ) {
    id
    name
    tag
    cooldown
    icon
    description
  }
}
```

```js
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODlhMTBlN2Y0NmU1NDA2YTg3NGU>
```

### - Example response for Create Battle Spell API

```json
{
  "data": {
    "createBattleSpell": {
      "id": "1",
      "name": "Flicker",
      "tag": "Berpindah secara cepat",
      "cooldown": 120,
      "icon": "flicker.png",
      "description": "A spell that allows the caster to quickly reposition."
    }
  }
}
```

## 2. Get All Battle Spell API

Description: This query retrieves all battle spells from the database, including their ID, name, tag, cooldown, icon, and description.

### - Example query for Get All Battle Spell API

```
query {
  getAllBattleSpells {
    id
    name
    tag
    cooldown
    icon
    description
  }
}
```

### - Example response for Get All Battle Spell API

```json
{
  "data": {
    "getAllBattleSpells": [
      {
        "id": "1",
        "name": "Flicker",
        "tag": "Berpindah secara cepat",
        "cooldown": 120,
        "icon": "flicker.png",
        "description": "A spell that allows the caster to quickly reposition."
      },
      {
        "id": "2",
        "name": "Fireball",
        "tag": "Serangan api",
        "cooldown": 180,
        "icon": "fireball.png",
        "description": "A spell that launches a fiery ball at the enemy."
      }
    ]
  }
}
```

## 3. Get Battle Spell By Id API

Description: This query retrieves a specific battle spell by its ID, returning its attributes such as name, tag, cooldown, icon, and description.

### - Example query for Get Battle Spell By Id API

```
query {
  getBattleSpellById(id: "1") {
    id
    name
    tag
    cooldown
    icon
    description
  }
}
```

### - Example response for Get Battle Spell By Id API

```json
{
  "data": {
    "getBattleSpellById": {
      "id": "1",
      "name": "Flicker",
      "tag": "Berpindah secara cepat",
      "cooldown": 120,
      "icon": "flicker.png",
      "description": "A spell that allows the caster to quickly reposition."
    }
  }
}
```

## 4. Update Battle Spell API

Description: This mutation allows you to update an existing battle spell's attributes such as name, tag, cooldown, icon, and description by providing its ID.

### - Example schema field for Update Battle Spell API

```
mutation {
  updateBattleSpell(
    id: string,
    updateBattleSpellInput: {
      name: string,
      tag: string,
      cooldown: number,
      icon: string,
      description: string
    }
  ) {
    id
    name
    tag
    cooldown
    icon
    description
  }
}
```

- HTTP Headers:

```js
Authorization: Bearer <access_token>
```

### - Example mutation for Update Battle Spell API

```
mutation {
  updateBattleSpell(
    id: "1",
    updateBattleSpellInput: {
      name: "Flicker",
      tag: "Berpindah secara cepat",
      cooldown: 100,
      icon: "flicker.png",
      description: "A spell that allows the caster to quickly reposition."
    }
  ) {
    id
    name
    tag
    cooldown
    icon
    description
  }
}
```

```js
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODlhMTBlN2Y0NmU1NDA2YTg3NGU>
```

### - Example response for Update Battle Spell API

```json
{
  "data": {
    "updateBattleSpell": {
      "id": "1",
      "name": "Flicker",
      "tag": "Berpindah secara cepat",
      "cooldown": 100,
      "icon": "flicker.png",
      "description": "A spell that allows the caster to quickly reposition."
    }
  }
}
```

## 5. Remove Battle Spell API

Description: This mutation allows you to delete a specific battle spell by its ID.

### - Example schema field for Remove Battle Spell API

```
mutation {
  removeBattleSpell(id: string) {
    id
    name
    tag
    cooldown
    icon
    description
  }
}
```

- HTTP Headers:

```js
Authorization: Bearer <access_token>
```

### - Example mutation for Remove Battle Spell API

```
mutation {
  removeBattleSpell(id: "60c72b2f9b1e8c001c0a1b2c") {
    id
    name
    tag
    cooldown
    icon
    description
  }
}
```

- HTTP Headers:

```js
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODlhMTBlN2Y0NmU1NDA2YTg3NGU>
```

### - Example response for Remove Battle Spell API

```json
{
  "data": {
    "deleteBattleSpell": {
      "id": "1",
      "name": "Flicker",
      "tag": "Berpindah secara cepat",
      "cooldown": 100,
      "icon": "flicker.png",
      "description": "A spell that allows the caster to quickly reposition."
    }
  }
}
```
