<template>
  <div id="app">
    <button class="addNew" @click="addNewRow">Add new row</button>
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
      <input v-model="filter" placeholder="Введите фильтр" />
      <button @click="addFilter">Добавить фильтр</button>
    </div>
    <div class="flex">
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
      </tr>
      <tr v-for="row in tableArrayPage" :key="row.id">
        <td>{{row.date}}</td>
        <td>{{row.name}}</td>
        <td>{{row.amount}}</td>
        <td>{{row.distance}}</td>
      </tr>

    </table>
    <div class="pages">
      <div class="flex">
        <button @click="goToPage(currentPage-1)" class="pages__button">Назад</button>
        <button class="pages__number" :class="{'pages__number-active':currentPage==page}" v-for="page in pagesNow" @click="goToPage(page)">{{page}}</button>
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



export default {
  name: 'App',
  components: {

  },
  data() {
    return {
      conditionArray: [{ id: 0, name: "больше" }, { id: 1, name: "меньше" }, { id: 2, name: "равно" }, { id: 3, name: "содержит" }],
      selectedColumn: null,
      selectedCondition: null,
      sortByColumnId: 1,
      filter: '',
      filterArray: [],
      columnArray: [{ id: 1, name: "Название", sorted: false }, { id: 2, name: "Количество", sorted: false }, { id: 3, name: "Расстояние", sorted: false },],
      tableArray: [{ id: 1, date: '12/12/12', name: 'name', amount: 145, distance: 23 }, { id: 2, date: '12/12/12', name: 'ame', amount: 1, distance: 123 }, { id: 3, date: '12/12/12', name: 'name', amount: 145, distance: 23 }, { id: 4, date: '12/12/12', name: 'ame', amount: 1, distance: 123 }],
      tableArrayTemp: [],
      tableArrayPage: [],
      pageSize: 5,
      currentPage: 1,
      pages: 1,
    }
  },
  mounted() {
    this.tableArrayTemp = this.tableArray;
  },
  // watch: {
  //   // эта функция запускается при любом изменении вопроса
  //   question: function (newQuestion, oldQuestion) {
  //     this.answer = 'Ожидаю, когда вы закончите печатать...'
  //     this.debouncedGetAnswer()
  //   }
  // },
  computed: {
    pagesNow() {
      this.tableArrayPage = this.tableArrayTemp.filter((row, index) => {
        let start = (this.currentPage - 1) * this.pageSize;
        let end = this.currentPage * this.pageSize;
        if (index >= start && index < end) return true;
      })
      console.log('change')
      return Math.ceil(this.tableArrayTemp.length / this.pageSize)
    }
  },
  methods: {
    goToPage(page) {
      if(page>0&&page<=Math.ceil(this.tableArrayTemp.length / this.pageSize)){
        this.currentPage = page;
      }
      // this.tableArrayPage = this.tableArrayTemp.filter((row, index) => {
      //   let start = (this.currentPage - 1) * this.pageSize;
      //   let end = this.currentPage * this.pageSize;
      //   if (index >= start && index < end) return true;
      // })
    },
    addNewRow() {
      this.tableArrayTemp.push({ id: Math.ceil(Math.random() * 1000), date: '12/12/12', name: 'name', amount: Math.random() * 100, distance: Math.random() * 100 });
    },
    addFilter() {
      if (this.filter.trim() !== '' && this.selectedColumn !== null && this.selectedCondition !== null) {
        console.log('addFilter');
        this.filterArray.push({ column: this.selectedColumn, condition: this.selectedCondition, filterInput: this.filter });
        this.useFilter({ column: this.selectedColumn, condition: this.selectedCondition, filterInput: this.filter });
      }
    },
    useFilter(filter) {
      console.log(filter)
      switch (filter.column) {
        case 'Название':
          console.log('name');
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
          console.log(filter[column]);
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
      this.tableArrayTemp = this.tableArray;
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
          console.log('ff')
        }
        return column
      })
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family:  sans-serif;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.addNew{
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
select{
  height:30px;
  border-radius: 5px;
}
input{
  height:26px;
  margin-right: 5px;
  border-radius: 5px;
  border: 1px solid grey;
}
.filter {
  margin-bottom: 10px;
  align-items: center;
  display: flex;
  justify-content: center;
  .category{
    margin-right:5px;
  }
}

.container {
  background-color: rgb(145, 232, 232);
  // width:200px;
  padding: 4px;
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
button{
  background-color: white;
  font-family: sans-serif;
    cursor: pointer;
    font-weight: 400;
    padding: 5px;
    color:blue;
    font-size: 16px;
    border-radius: 5px;
    border:0.5px solid blue;
}

.pages {
  display: flex;
  justify-content: center;
  &__number{
    font-weight: 500;
    padding: 5px;
    margin-right: 5px;
    width:30px;
    &-active{
      background-color: blue;
      color:white;
    }
  }
  &__button{
    margin-right: 5px;
    border-radius: 5px;
  }
}
</style>

