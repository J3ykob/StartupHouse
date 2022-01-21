# ZOMBIE API Documentation

[![Zombie API](https://github.com/J3ykob/StartupHouse/actions/workflows/node.js.yml/badge.svg)](https://github.com/J3ykob/StartupHouse/actions/workflows/node.js.yml)

API used to interact with alternative apocalyptic world 😬

### Run the API locally

`npm install`

`npm start` to start the app

`npm test` to run the tests


---

`docker-compose up -d` to run the docker container

`docker-compose down` to stop the container

**The API runs on port 3000 by default**



# Zombie endpoint 

### `GET /zombies`
Used to get the list of all zombies from database
#### Request schema
```
---
```
#### Example response
```
[
	{
		name: "Zombie1",
		_id: "123",
		createdAt: "2000-10-31T01:30:00.000-05:00",
		items: [
			name: "item1",
			id: 1,
			price: 30
		]
	},
	{
		name: "Zombie2",
		_id: "456",
		createdAt: "2002-10-31T01:30:00.000-05:00",
		items: [
			name: "item2",
			id: 3,
			price: 50
		]
	}
]
```

### `POST /zombies`
Used to add new zombies to the database (list of zombies accepted).
#### Request schema
```
body: {
	zombies: [{
		name: "Zombie1",
		createdAt: "2002-10-31T01:30:00.000-05:00", 					//optional
		items: [									//optional
			name: "item1",
			id: 1,
			price: 20
		}]
	]
}

or

body: {
	zombies: ["Zombie1", "Zombie2", "Zombie3"]
}

```
#### Example response
```
{
	payload: [{
		name: "Zombie1",
		createdAt: "2002-10-31T01:30:00.000-05:00", 
		items: [									//if specified
			name: "item1",
			id: 1,
			price: 20
		]
	}]
}
```
---
### `DELTE /zombies`
Used to delete many zombies at once
#### Request schema
```
body: {
	zombies: [{
		name: "Zombie1",
		createdAt: "2002-10-31T01:30:00.000-05:00",
		items: [									
			name: "item1",
			id: 1,
			price: 20
		]
	}]
}

or

body: {
	zombies: ["123", "456", "789"]							//Specify only zombie IDs
}
```
#### Example response
```
{
	success: [									//all successfully deleted zombies
		{
			name: "Zombie1",
			_id: "123"
			createdAt: "2002-10-31T01:30:00.000-05:00",
			items:[]
		}
	],
	error: []									//zombies which weren't deleted
}
```
---
### `GET /zombies/:zombieId`
Used to get details about certain zombie, selected by its ID. Returns creation date and zombie's name.
#### Request schema
```
params: {
	zombieId: "123"
}
```
#### Example response
```
{
		name: "Zombie1",
		createdAt: "2002-10-31T01:30:00.000-05:00",
}
```

### `GET /zombies/:zombieId/items`
Used to add item to zombie. Uses external items database to get the available items. List of allowed items available here: https://zombie-items-api.herokuapp.com/api/items
#### Request schema
```
params: {
	zombieId: "123"
}
```
#### Example response
```
[
	{
		name: "item1",
		price: 200,
		id: 1
	},
	{
		name: "item2",
		price: 300,
		id: 3
	}
]
```

### `GET /zombies/:zombieId/value`
Used to get the calculated value of zombie's items. The result is calculated in three currencies: EUR, USD, PLN.
#### Request schema
```
params: {
	zombieId: "123"
}
```
#### Example response
```
{
	EUR: 2.21
	PLN: 10
	USD: 2.5
}
```

### `POST /zombies/:zombieId/`
Used to add new item to the zombie's equipment. **Zombie can hold maximum of 5 items at once**
#### Request schema
```
params: {
	zombieId: "123",
}

body: {
	itemsId: [1,2]
}
```
#### Example response
```
{
		name: "Zombie1",
		createdAt: "2002-10-31T01:30:00.000-05:00",
		items: [{									
			name: "item1",					//newly added item
			id: 1,
			price: 20
		},{
			name: "item2",					//newly added item
			id: 2,
			price: 30
		}
		]
	}
```

### `DELETE /zombies/:zombieId/:itemName`
Used to delete item from zombie's equipment.
#### Request schema
```
params: {
	zombieId: "123",
}

body: {
	itemsId: [2]
}
```
#### Example response
```
{
		name: "Zombie1",
		createdAt: "2002-10-31T01:30:00.000-05:00",
		items: [{									
			name: "item2",				// item1 was deleted!
			id: 1,
			price: 20
		}]
	}
```

