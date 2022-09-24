<template>
  <div id="app">
    <button class="addNew" @click="addNewRow">Добавить новую колонку</button>
    <div class="filter">
      <select class="category" v-model="selectedColumn">
        <option selected disabled value="null">Выберите колонку</option>
        <option v-for="column in columnArray" :value="column.name">{{column.name}}</option>
      </select>
      <select class="category" v-model="selectedCondition">
        <option selected disabled value="null">Выберите условие</option>
        <option v-if="selectedColumn!=='Название'" v-for="condition in conditionArray" :value="condition.name">
          {{condition.name}}</option>
        <option v-if="selectedColumn=='Название'" value="совпадает">совпадает</option>
      </select>
      <input v-model="filter" placeholder="Введите фильтр" v-on:keyup.enter="addFilter" />
      <button @click="addFilter">Добавить фильтр</button>
    </div>

    <div class="flex filter-array">
      <h5>Фильтры:</h5>
      <ul class="flex">
        <li class="container" v-for="filter in filterArray">
          <span class="container__name">{{filter.column}} {{filter.condition}} {{filter.filterInput}}</span>
          <span class="container__close" @click="deleteFilter(filter)">x</span>
        </li>
      </ul>
    </div>
    <table>
      <tr>
        <th>
          <span>Дата</span>
        </th>
        <th v-for="column in columnArray">
          <div class="column flex">
            <span>{{column.name}}</span>
            <img class="column__img" :class="{column__img__down:column.sorted===true?true:false}"
              src="./assets/sort.png" width="20px" @click="sortByColumn(column.id)" />
          </div>
        </th>
        <th>
        </th>
      </tr>
      <tr v-for="row in tableArrayPage" :key="row.id">
        <td>{{row.date}}</td>
        <td>{{row.name}}</td>
        <td>{{row.amount}}</td>
        <td>{{row.distance}}</td>
        <td class="delete" @click="deleteRow(row.id)">X</td>
      </tr>

    </table>
    <div class="pages">
      <div class="flex">
        <button @click="goToPage(currentPage-1)" class="pages__button">Назад</button>
        <button class="pages__number" :class="{'pages__number-active':currentPage==page}" v-for="page in pagesNow"
          @click="goToPage(page)">{{page}}</button>
        <button @click="goToPage(currentPage+1)" class="pages__button">Вперед</button>
      </div>
      <select v-model="pageSize">
        <option>5</option>
        <option>10</option>
        <option>50</option>
        <option>100</option>
      </select>
    </div>
  </div>
</template>

<script>
import { getEntries, postEntry, deleteEntry } from './assets/api/entry';

export default {
  name: 'App',
  data() {
    return {
      conditionArray: [{ id: 0, name: "больше" }, { id: 1, name: "меньше" }, { id: 2, name: "равно" }],
      selectedColumn: null,
      selectedCondition: null,
      sortByColumnId: 1,
      // String from input
      filter: '',
      filterArray: [],
      columnArray: [{ id: 1, name: "Название", sorted: false }, { id: 2, name: "Количество", sorted: false }, { id: 3, name: "Расстояние", sorted: false },],
      tableArrayTemp: [],
      tableArrayPage: [],
      pageSize: 5,
      currentPage: 1,
      pages: 1,
    }
  },
  mounted() {
    getEntries().then(response => {
      this.tableArrayTemp = response.data;
    })
  },
  watch: {
    //if column changed, reset condition
    selectedColumn() {
      this.selectedCondition = null;
    }
  },
  computed: {
    //amount of pages
    pagesNow() {
      this.tableArrayPage = this.tableArrayTemp.filter((row, index) => {
        let start = (this.currentPage - 1) * this.pageSize;
        let end = this.currentPage * this.pageSize;
        if (index >= start && index < end) return true;
      })
      return Math.ceil(this.tableArrayTemp.length / this.pageSize)
    }
  },
  methods: {
    goToPage(page) {
      if (page > 0 && page <= Math.ceil(this.tableArrayTemp.length / this.pageSize)) {
        this.currentPage = page;
      }
    },
    addNewRow() {
      postEntry({ date: new Date().toISOString().split('T')[0], name: (Math.random() + 1).toString(36).substring(2, 6), amount: Math.ceil(Math.random() * 100), distance: Math.ceil(Math.random() * 100) })
        .then(response => this.tableArrayTemp.push(response.data));
    },
    deleteRow(id) {
      deleteEntry(id).then(response => {
        console.log(response.data.message);
        this.tableArrayTemp = this.tableArrayTemp.filter(item => item.id !== id);
      })
    },
    addFilter() {
      if (this.filter.trim() !== '' && this.selectedColumn !== null && this.selectedCondition !== null) {
        if (this.selectedColumn !== 'Название') {
          let regex = /^[0-9]+$/;
          if (!this.filter.trim().match(regex)) {
            alert("Неправильный ввод фильтра: используйте число");
            return false;
          }
        }
        this.filterArray.push({ column: this.selectedColumn, condition: this.selectedCondition, filterInput: this.filter.trim() });
        this.useFilter({ column: this.selectedColumn, condition: this.selectedCondition, filterInput: this.filter.trim() });
        this.filter = ''
      }
    },
    useFilter(filter) {
      switch (filter.column) {
        case 'Название':
          this.tableArrayTemp = this.tableArrayTemp.filter((item) => item.name.toLowerCase().includes(filter.filterInput.toLowerCase()));
          break;
        case "Количество":
          this.compareNums(filter, 'amount');
          break;
        case "Расстояние":
          this.compareNums(filter, 'distance');
          break;
      }
    },
    compareNums(filter, column) {
      switch (filter.condition) {
        case 'больше':
          this.tableArrayTemp = this.tableArrayTemp.filter((item) => item[column] >= filter.filterInput);
          break;
        case 'меньше':
          this.tableArrayTemp = this.tableArrayTemp.filter((item) => item[column] <= filter.filterInput);
          break;
        case 'равно':
          this.tableArrayTemp = this.tableArrayTemp.filter((item) => item[column] == filter.filterInput);
          break;
      }
    },
    deleteFilter(filter) {
      this.filterArray = this.filterArray.filter((item) => {
        if (item.column === filter.column && item.condition === filter.condition && item.filterInput === filter.filterInput) {
          return false;
        }
        return true;
      })
      getEntries().then(response => {
        this.tableArrayTemp = response.data;
      })
      this.filterArray.map((filter) => {
        this.useFilter(filter);
      })
    },
    sortString(a, b) {
      let nameA = a.name.toLowerCase();
      let nameB = b.name.toLowerCase();
      if (nameA < nameB)
        return -1;
      if (nameA > nameB)
        return 1;
      return 0;
    },
    sortByColumn(id) {
      this.columnArray = this.columnArray.map((column) => {
        if (column.id === id) {
          switch (id) {
            case 1:
              !column.sorted ? this.tableArrayTemp.sort(this.sortString) : this.tableArrayTemp.sort(this.sortString).reverse();
              break;
            case 2:
              !column.sorted ? this.tableArrayTemp.sort((a, b) => a.amount - b.amount) : this.tableArrayTemp.sort((a, b) => b.amount - a.amount);
              break;
            case 3:
              !column.sorted ? this.tableArrayTemp.sort((a, b) => a.distance - b.distance) : this.tableArrayTemp.sort((a, b) => b.distance - a.distance);
              break;
          }
          column.sorted = !column.sorted;
        }
        return column
      })
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: sans-serif;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.addNew {
  margin-bottom: 5px;
}

ul {
  list-style-type: none;
  padding: 0;
  text-align: left;
  flex-wrap: wrap;
  flex-direction: row;
}

.flex {
  display: flex;
  flex-direction: row;
}

select {
  height: 30px;
  border-radius: 5px;
}

input {
  height: 26px;
  margin-right: 5px;
  border-radius: 5px;
  border: 1px solid grey;
}

.filter {
  margin-bottom: 10px;
  align-items: center;
  display: flex;
  justify-content: center;

  .category {
    margin-right: 5px;
  }
}

.container {
  background-color: blue;
  color: white;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  border: 1px solid cyan;
  border-radius: 5px;
  margin-right: 4px;
  margin-bottom: 4px;

  &__name {
    margin-right: 5px;
  }

  &__close {
    font-weight: 600;
    align-self: baseline;
    cursor: pointer;
  }
}

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 10px;

  td,
  th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;

  }

  .delete {
    cursor: pointer;
  }

  .column {
    justify-content: space-between;
    align-items: center;

  }

  .column__img {
    cursor: pointer;

    &__down {
      transform: rotate(180deg);
    }

    // transform: rotate(180deg);
  }

  tr:nth-child(even) {
    background-color: #dddddd;
  }
}

button {
  background-color: white;
  font-family: sans-serif;
  cursor: pointer;
  font-weight: 400;
  padding: 5px;
  color: blue;
  font-size: 16px;
  border-radius: 5px;
  border: 0.5px solid blue;
  transition: 0.3s;

  &:hover {
    background-color: #6054ca;
    color: white;
  }
}

.pages {
  display: flex;
  justify-content: center;

  &__number {
    font-weight: 500;
    padding: 5px;
    margin-right: 5px;
    width: 30px;

    &-active {
      background-color: blue;
      color: white;
    }
  }

  &__button {
    margin-right: 5px;
    border-radius: 5px;
  }
}
</style>

