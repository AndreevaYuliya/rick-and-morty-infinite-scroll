// Task 1

// Створити функцію, яка при створенні приймає об'єкт, наприклад: {access-token: 'qwerty'}
// і додає його до кожної структури даних, що буде передана в результатуючу функцію.
// Також до об'єкта буде додано поле count. При кожному виклику воно має збільшуватися на 1.

// Приклад:

// function addParamsToRequest(params) {........}

// const sendData = addParamsToRequest(.........);

// const result = sendData(......some data.....);

// console.log(result);

// Результат має виглядати як об'єкт:

// {
//   access-token: 'qwerty',

//   data: …… // всі поля з об'єкта, переданого в addParamsToRequest

//   count: 0 // 1 … 2 … 3 … збільшується з кожним викликом sendData
// }

function addParamsToRequest(params) {
  let count = -1;

  return function (data) {
    count += 1;

    return {
      ...params,
      data,
      count,
    };
  };
}

const sendData = addParamsToRequest({ "access-token": "qwerty" });

const result1 = sendData({
  name: "Yuliia",
  age: 25,
});
console.log(result1);

const result2 = sendData({
  product: "Vika",
  price: 20,
});
console.log(result2);

// Task 2

// У вас є об'єкт:

// const obj = {
//   getData: function () {
//     console.log(`Person name is: ${this.name} and age ${this.age}`);
//   },
// };

// Викличте його так, щоб ім'я та вік були вказані (значення неважливі). Потім створіть функцію, яка буде це робити постійно при її виклику.

const obj = {
  getData: function () {
    console.log(`Person name is: ${this.name} and age ${this.age}`);
  },
};

const showPersonData = obj.getData.bind({
  name: "Alex",
  age: 20,
});

showPersonData();

// or using call

function showPersonData2(name, age) {
  obj.getData.call({
    name,
    age,
  });
}

showPersonData2("Yuliia", 25);
showPersonData2("Vika", 20);

// Task 3

// Задача — пройтися по об'єкту рекурсивно, знайти всі файли та повернути їхні імена у вигляді масиву.

const root = {
  name: "name",

  type: "folder",

  children: [
    {
      name: "folder 1",

      type: "folder",

      children: [
        {
          name: "folder 2",

          type: "folder",

          children: [
            {
              name: "file 3",

              type: "file",

              size: 30,
            },
          ],
        },
      ],
    },

    {
      name: "file 1",

      type: "file",

      size: 10,
    },

    {
      name: "file 2",

      type: "file",

      size: 20,
    },
  ],
};

function findAllFiles(node) {
  let files = [];

  if (node.type === "file") {
    files.push(node.name);
  } else {
    node.children?.forEach((child) => {
      files.push(...findAllFiles(child));
      // or
      // files = files.concat(findAllFiles(child));
    });
  }
  return files;
}

const allFiles = findAllFiles(root);
console.log(allFiles);

// Task 4

// Створіть базовий об'єкт Людина з такими властивостями:

// - name

// - phone

// Метод introduce, який виводить у консоль фразу: Привіт, мене звати {name}, мій номер {phone}.

// Створіть об'єкти Студент і Викладач, які будуть наслідувати властивості та методи від об'єкта Людина.

// - Для Студента додайте додаткову властивість course (курс) і метод study, який виводить: Я навчаюся на {course} курсі.

// - Для Викладача додайте додаткову властивість subject (предмет) і метод teach, який виводить: Я викладаю {subject}.

// Реалізуйте наслідування за допомогою конструктора функції або класів (оберіть один підхід).

// Очікуваний результат:

// При створенні об'єктів студента та викладача, вони повинні мати доступ до методу introduce з об'єкта Людина,
// а також до своїх специфічних методів (study і teach).

// Виконати у форматі ES5 та ES6 (тобто як через class, так і через prototype).

// ES6

class Person1 {
  constructor(name, phone) {
    this.name = name;
    this.phone = phone;
  }

  introduce() {
    console.log(`Привіт, мене звати ${this.name}, мій номер ${this.phone}.`);
  }

  getName() {
    return (this.name = name);
  }

  setName(name) {
    this.name = name;
  }

  getPhone() {
    return (this.phone = phone);
  }

  setPhone(phone) {
    this.phone = phone;
  }
}

class Student1 extends Person1 {
  constructor(name, phone, course) {
    super(name, phone);

    this.course = course;
  }

  study() {
    console.log(`Я навчаюся на ${this.course} курсі.`);
  }

  getCourse() {
    return (this.course = course);
  }

  setCourse(course) {
    this.course = course;
  }
}

class Lector1 extends Person1 {
  constructor(name, phone, subject) {
    super(name, phone);

    this.subject = subject;
  }

  teach() {
    console.log(` Я викладаю ${this.subject}.`);
  }

  getSubject() {
    return (this.subject = subject);
  }

  setSubject(subject) {
    this.subject = subject;
  }
}

const student1 = new Student1("Yuliia", "0984567890", 2);

student1.introduce();
student1.study();

const lector1 = new Lector1();
lector1.name = "Vika";
lector1.phone = "0965498234";
lector1.subject = "Math";
lector1.introduce();
lector1.teach();

// ES5

function Person2(name, phone) {
  this.name = name;
  this.phone = phone;
}

Person2.prototype.introduce = function () {
  console.log(`Привіт, мене звати ${this.name}, мій номер ${this.phone}.`);
};

function Student2(name, phone, course) {
  Person2.call(this, name, phone);
  this.course = course;
}

Student2.prototype = Object.create(Person2.prototype);
Student2.prototype.constructor = Student2;

Student2.prototype.study = function () {
  console.log(`Я навчаюся на ${this.course} курсі.`);
};

function Lector2(name, phone, subject) {
  Person2.call(this, name, phone);
  this.subject = subject;
}

Lector2.prototype = Object.create(Person2.prototype);
Lector2.prototype.constructor = Lector2;

Lector2.prototype.teach = function () {
  console.log(` Я викладаю ${this.subject}.`);
};

const student2 = new Student2("Yuliia", "0984567890", 2);
student2.introduce();
student2.study();

const lector2 = new Lector2();
lector2.name = "Vika";
lector2.phone = "0965498234";
lector2.subject = "Math";
lector2.introduce();
lector2.teach();
