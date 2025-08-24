# **Skill API Table of Contents**

## Skill API Table of Contents

- [**Skill API Table of Contents**](#skill-api-table-of-contents)
  - [Skill API Table of Contents](#skill-api-table-of-contents-1)
  - [1. Create Skill API](#1-create-skill-api)
    - [- Example schema field for Create Skill API](#--example-schema-field-for-create-skill-api)
    - [- Example mutation for Create Skill](#--example-mutation-for-create-skill)
    - [- Example response for Create Skill](#--example-response-for-create-skill)
  - [2. Add Skill to Hero API](#2-add-skill-to-hero-api)
    - [- Example schema field for Add Skill to Hero API](#--example-schema-field-for-add-skill-to-hero-api)
    - [- Example mutation for Add Skill to Hero](#--example-mutation-for-add-skill-to-hero)
    - [- Example response for Add Skill to Hero](#--example-response-for-add-skill-to-hero)
  - [3. Update Hero with Skill API](#3-update-hero-with-skill-api)
    - [- Example schema field for Update Hero with Skill API](#--example-schema-field-for-update-hero-with-skill-api)
    - [- Example mutation for Update Hero with Skill](#--example-mutation-for-update-hero-with-skill)
    - [- Example response for Update Hero with Skill](#--example-response-for-update-hero-with-skill)
  - [4. Find All Skill API](#4-find-all-skill-api)
    - [- Example query for Find All Skill](#--example-query-for-find-all-skill)
    - [- Example response for Find All Skill](#--example-response-for-find-all-skill)
  - [5. Find Skill by ID API](#5-find-skill-by-id-api)
    - [- Example query for Find Skill by ID](#--example-query-for-find-skill-by-id)
    - [- Example response for Find Skill by ID](#--example-response-for-find-skill-by-id)
  - [6. Update Skill API](#6-update-skill-api)
    - [- Example schema field for Update Skill API](#--example-schema-field-for-update-skill-api)
    - [- Example mutation for Update Skill](#--example-mutation-for-update-skill)
    - [- Example response for Update Skill](#--example-response-for-update-skill)
  - [7. Remove Skill API](#7-remove-skill-api)
    - [- Example schema field for Remove Skill](#--example-schema-field-for-remove-skill)
    - [- Example mutation for Remove Skill](#--example-mutation-for-remove-skill)
    - [- Example response for Remove Skill](#--example-response-for-remove-skill)

## 1. Create Skill API

Description: This mutation allows you to create a new skill with attributes such as name, type, tag, attack effect, skill icon, lite description, full description, and an array of skill details that include level and attributes. You can return the created skill's ID and other attributes based on your needs.

### - Example schema field for Create Skill API

```
mutation {
  createSkill(
    input: {
      name: string
      type: string
      tag: string[]
      attack_effect?: number
      skill_icon: string
      lite_description: string
      full_description: string
    }
  ) {
    _id
    name
    type
    tag
    // etc...
  }
}
```

- HTTP Headers:

```js
Authorization: Bearer <access_token>
```

### - Example mutation for Create Skill

```
mutation {
  createSkill(
    input: {
      name: "Blood Ancestry",
      type: "Passive",
      tag: ["Buff"],
      skill_icon: "https://akmweb.youngjoygame.com/web/svnres/img/mlbb/homepage/100_d4efd4dc88ba1f3ab47c15e1b57abdaa.png",
      lite_description: "Alice possesses higher Mana Regen, and her Movement Speed and Healing Receiver increase with her level.",
      full_description: "Alice memulihkan 3% Max Mana setiap detik. Setiap kali level Alice naik, dia meningkatkan 3 Movement Speed-nya dan 1% Pemulihan yang Diterima.",
    }
  ) {
    _id
    name
    type
    tag
    // etc...
  }
}
```

- HTTP Headers:

```js
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODlhMTBlN2Y0NmU1NDA2YTg3NGU>
```

### - Example response for Create Skill

```json
"data": {
  "createSkill": {
    "_id": "60c72b2f9b1e8c001c0a1b2d",
    "name": "Blood Ancestry",
    "type": "Passive",
    "tag": ["Buff"],
    // etc ...
  }
}
```

## 2. Add Skill to Hero API

Description: This mutation allows you to create a skill and add it to an existing hero. You can specify the hero by their ID and return the updated hero's ID and skills based on your needs.

### - Example schema field for Add Skill to Hero API

```
mutation {
  addSkillToHero(
    heroId: string,
    input: {
      name: string
      type: string
      tag: string[]
      attack_effect?: number
      skill_icon: string
      lite_description: string
      full_description: string
    }
  ) {
    _id
    name
    skills {
      _id
      name
      type
      tag
      // etc...
    }
  }
}
```

- HTTP Headers:

```js
Authorization: Bearer <access_token>
```

### - Example mutation for Add Skill to Hero

```
mutation {
  addSkillToHero(
    heroId: "60c72b2f9b1e8c001c0a1b2d", // Alice's ID
    input: {
      name: "Blood Ancestry",
      type: "Passive",
      tag: ["Buff"],
      skill_icon: "https://akmweb.youngjoygame.com/web/svnres/img/mlbb/homepage/100_d4efd4dc88ba1f3ab47c15e1b57abdaa.png",
      lite_description: "Alice possesses higher Mana Regen, and her Movement Speed and Healing Receiver increase with her level.",
      full_description: "Alice memulihkan 3% Max Mana setiap detik. Setiap kali level Alice naik, dia meningkatkan 3 Movement Speed-nya dan 1% Pemulihan yang Diterima."
    }
  ) {
    _id
    name
    skills {
      _id
      name
      type
      tag
      // etc...
    }
  }
}
```

- HTTP Headers:

```js
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODlhMTBlN2Y0NmU1NDA2YTg3NGU>
```

### - Example response for Add Skill to Hero

```json
"data": {
  "addSkillToHero": {
    "_id": "60c72b2f9b1e8c001c0a1b2d",
    "name": "Alice",
    "skills": [
      {
        "_id": "60c72b2f9b1e8c001c0a1b2d",
        "name": "Blood Ancestry",
        "type": "Passive",
        "tag": ["Buff"],
        // etc ...
      },
    ]
  }
}
```

## 3. Update Hero with Skill API

Description: This mutation allows you to update an existing skill assigned to a hero by specifying the hero's ID and the skill's ID. You can change hero's skill to another hero or update the skill's attributes such as name, type, tag, attack effect, skill icon, lite description, full description, and skill details. You can return the updated hero's ID and skills based on your needs.

Note: If you move a skill to another hero, the skill will be removed from the original hero and this skill detail too. Recommend to combine `addSkillDetailToSkill` mutation in skill detail API docs after moving it.

### - Example schema field for Update Hero with Skill API

```
mutation {
  updateHeroWithSkills(
    fromHeroId: string, // current hero ID
    toHeroId: string, // target hero ID
    skillId: string, // skill ID
    input: {
      name: string
      type: string
      tag: string[]
      attack_effect?: number
      skill_icon: string
      lite_description: string
      full_description: string
    }
  ) {
    _id
    name
    skills {
      _id
      name
      // etc...
    }
  }
}
```

- HTTP Headers:

```js
Authorization: Bearer <access_token>
```

### - Example mutation for Update Hero with Skill

```
mutation {
  updateHeroWithSkills (
    fromHeroId: "6871f3276264b47e59cba6f5", // current hero ID
    toHeroId: "6871f3276264b47e59cba6f5", // target hero ID
    skillId: "6892f1f84987f39729d459cc", // skill ID
    input: {
      name: "Hidden Moonlight New 2"
      type: "Ultimate"
      tag: [
        "Conceal",
        "Menghapus CC"
      ]
      skill_icon: "https://akmweb.youngjoygame.com/web/svnres/img/mlbb/homepage/100_361546d795e6df7029a1cf1252e57ac8.png"
      lite_description: ""
      full_description: "tes"
    }
  ) {
    _id
    name
  }
}
```

- HTTP Headers:

```js
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODlhMTBlN2Y0NmU1NDA2YTg3NGU>
```

### - Example response for Update Hero with Skill

```json
"data": {
  "updateHeroWithSkills": {
    "_id": "6871f3276264b47e59cba6f5",
    "name": "Miya",
    "skills": [
      {
        "_id": "6892f1f84987f39729d459cc",
        "name": "Hidden Moonlight New 2"
      }
    ]
  }
}
```

## 4. Find All Skill API

Description: This query retrieves all skills from the database, including their ID, name, type, tag, and other attributes. You can customize the fields you want to retrieve based on your needs.

### - Example query for Find All Skill

```
query {
  skills {
    _id
    name
    type
    tag
    // etc...
  }
}
```

### - Example response for Find All Skill

```json
"data": {
  "skills": [
    {
      "_id": "60c72b2f9b1e8c001c0a1b2d",
      "name": "Blood Ancestry",
      "type": "Passive",
      "tag": ["Buff"],
      // etc ...
    },
    {
      "_id": "60c72b2f9b1e8c001c0a1b2e",
      "name": "Blood Oath",
      "type": "Active",
      "tag": ["Damage", "Control"],
      // etc ...
    }
  ]
}
```

## 5. Find Skill by ID API

Description: This query retrieves a specific skill by its ID, including all relevant attributes. You can customize the fields you want to retrieve based on your needs.

### - Example query for Find Skill by ID

```
query {
  skill(id: "60c72b2f9b1e8c001c0a1b2d") {
    _id
    name
    type
    tag
    // etc...
  }
}
```

### - Example response for Find Skill by ID

```json
"data": {
  "skill": {
    "_id": "60c72b2f9b1e8c001c0a1b2d",
    "name": "Blood Ancestry",
    "type": "Passive",
    "tag": ["Buff"],
    // etc ...
  }
}
```

## 6. Update Skill API

Description: This mutation allows you to update an existing skill by its ID. You can modify attributes such as name, type, tag, attack effect, skill icon, lite description, full description, and skill details. You can return the updated skill's ID and other attributes based on your needs.

### - Example schema field for Update Skill API

```
mutation {
  updateSkill(
    id: string,
    input: {
      name: string
      type: string
      tag: string[]
      attack_effect?: number
      skill_icon: string
      lite_description: string
      full_description: string
    }
  ) {
    _id
    name
    type
    tag
    // etc...
  }
}
```

- HTTP Headers:

```js
Authorization: Bearer <access_token>
```

### - Example mutation for Update Skill

```
mutation {
  updateSkill(
    id: "60c72b2f9b1e8c001c0a1b2d",
    input: {
      name: "Blood Ancestry Updated",
      type: "Passive",
      tag: ["Buff", "Updated"],
      skill_icon: "https://example.com/updated_icon.png",
      lite_description: "Updated description for Blood Ancestry.",
      full_description: "Updated full description for Blood Ancestry.",
    }
  ) {
    _id
    name
    type
    // etc...
  }
}
```

- HTTP Headers:

```js
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODlhMTBlN2Y0NmU1NDA2YTg3NGU>
```

### - Example response for Update Skill

```json
"data": {
  "updateSkill": {
    "_id": "60c72b2f9b1e8c001c0a1b2d",
    "name": "Blood Ancestry Updated",
    "type": "Passive",
    "tag": ["Buff", "Updated"],
    "skill_icon": "https://example.com/updated_icon.png",
    "lite_description": "Updated description for Blood Ancestry.",
    "full_description": "Updated full description for Blood Ancestry."
  }
}
```

## 7. Remove Skill API

Description: This mutation allows you to delete a skill by its ID. You can return a success message or the deleted skill's ID based on your needs.

### - Example schema field for Remove Skill

```
mutation {
  removeSkill(
    id: string
    ) {
    _id
    name
  }
}
```

- HTTP Headers:

```js
Authorization: Bearer <access_token>
```

### - Example mutation for Remove Skill

```
mutation {
  removeSkill(id: "60c72b2f9b1e8c001c0a1b2d") {
    _id
    name
  }
}
```

- HTTP Headers:

```js
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODlhMTBlN2Y0NmU1NDA2YTg3NGU>
```

### - Example response for Remove Skill

```json
"data": {
  "removeSkill": {
    "_id": "60c72b2f9b1e8c001c0a1b2d",
    "name": "Blood Ancestry"
  }
}
```
