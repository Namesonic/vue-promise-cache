# Promise Cache Class

> A useful javascript class for managing how to provide reactive references to a shared list of cached items retrieved via a promise, meant for use with VueJs.

Using the cache to find(id) an item either fetches data via the provided API, or returns the cached item data so that components sharing a list can maintain a reactive reference to the original item.

Using a shared cache can limit multiple requests for the same item to a single API request, while still providing a "placeholder" item until the API's promise is resolve.

**Demo** https://codepen.io/Namesonic/pen/BJEXzd

## Installation

```
npm install vue-promise-cache -D
```

## Usage

Import where needed in your Vue data structure:

```
import Cache from 'vue-promise-cache'

export default {
  data () {
    return {
      // Define sepearate lists referencing overlapping items
      myList: [ 1, 5, 7, 12, 18 ],
      yourList: [ 5, 6, 7, 10, 12, 13 ],

      // Create the primary cache
      people: new Cache( id => {
         return axios.get('people/' + id)
        }),

      // In this example, the primary cache contains an array of IDs to a secondary cache
      cars: new Cache( id => {
         return axios.get('cars/' + id)
        })
    }
  }
}
```

Or in your VueX store state:

```
export default {
  state: {
    people: new Cache( id => axios.get('people/' + id )
    cars: new Cache( id => axios.get('cars/' + id )
  },
  getters: {
    person (state) => (id) => {
      return state.people.find(id)
    },
    car (state) => (id) => {
      return state.cars.find(id)
    }    
  }
}
```

Then use in various ways in your Vue html markup, like this example:

```
<div v-for="item in people.list(myItems)" style="margin-bottom: 5px;">
  <div style="float: left; padding-right: 5px;">
    <button @click="removeMyItem(item.id)">
      #{{item.id}}
    </button>
  </div>
  <div style="float: left;" v-if="item.isReady">
    <div v-if="item.hasError">
      <i style="color:red;">{{item.error}}</i>
    </div>
    <div v-else>
      {{item.data.name}}
      <blockquote v-if="item.data.cars">
        <div v-for="car in cars.list(item.data.cars)">
          <div v-if="car.isReady">
            <div v-if="car.hasError">
              #{{car.id}} -> <i style="color: red">{{ car.error }}</i>
            </div>
            <div v-else>
              #{{car.id}} -> {{ car.data.name }}
            </div>
          </div>
          <div v-else>
            #{{car.id}} -> Loading...
          </div>
        </div>
      </blockquote>
    </div>
  </div>
  <div v-else style="float: left;">
    Loading...
  </div>
  <br clear="both"/>
</div>
```

## Constructor

This class must be instiantiated with a call back function that returns a promise.  Usually this would be a Promise returned from an AJAX transport like axios.  Alternatively, you can return your own promise with the data you are providing to the cache.  

The callback function can accept paramters, in this example, the UNIQUE ID of the cached item that we are seeking.

```
(id) => {
  return new Promise((resolve, reject) => {
    // Resolve with data to be cached
    resolve({id: 4, name: 'test item'})
  })
}
```

## Items

The cache class holds an array of "CachedItem"  objects.  Item objects contain the following properties:


**Variables**

<dl>
  <dt>_ready</dt>
  <dd>Has the loading of the cached item completed?</dd>
  <dt>_error</dt>
  <dd>An error message if an exception occurred</dd>
  <dt>_data</dt>
  <dd>The actual data that the item represents</dd>
</dl>

## Methods

<dl>
  <dt>remove(id)</dt>
  <dd>Removes the item from the cache array by its ID</dd>
  <dt>has(id)</dt>
  <dd>Returns boolean if item is present in the cache</dd>
  <dt>find(id)</dt>
  <dd>Returns the cached item locaed by its ID</dd>
  <dt>all()</dt>
  <dd>Returns an array of all the cached items</dd>
  <dt>add(Object)</dt>
  <dd>Adds a RAW data object to the cache</dd>
</dl>

## Future Versions

There are some things that would be good to add.

### Methods

* add(item)    # adds item to the cache
* update(item) # updates the item data


### Prepopulating

You can manually add data to the cache when you receive it.  The cache will either update existing items or create new CachedItem's.

### Cache Expire

Timestamp the activity on the cached item and remove the cached items that arren't being loaded.
