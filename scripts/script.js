
var app = angular
    .module("myApp", ["ngRoute"])
    .config(function ($routeProvider) {
        $routeProvider
            .when("/home", {
                templateUrl: "templates/home.html",
                controller: "homeController"
            })
            .when("/courses", {
                templateUrl: "templates/courses.html",
                controller: "coursesController"
            })
            .when("/students", {
                templateUrl: "templates/students.html",
                controller: "studentsController",
                resolve: {
                    studentList: ($http) => {
                       return $http.get("https://jsonplaceholder.typicode.com/users")
                        .then(data => data.data)
                    }
                }
            })
            .when("/students/:id", {
                templateUrl: "templates/studentDetails.html",
                controller: "studentDetailsController"
            })
            .when("/studentsSearch/:name?", {
                templateUrl: "templates/studentSearch.html",
                controller: "studentsSearchController"
            })
            .otherwise({
                template: "<h1> No template selected!! </h1>"
            })
    })
    .controller("homeController", function ($scope) {
        $scope.home = "home";
    })
    .controller("coursesController", function ($scope) {
        $scope.courses = [
            { name: "JavaScript" },
            { name: ".Net" },
            { name: "Visual Basic" },
            { name: "Html" }
        ]
    })
    .controller("studentsController", function (studentList, $scope, $location) {
        $scope.searchStudent = () => {
            $scope.name ? 
            $location.url("/studentsSearch/" + $scope.name) : 
            $location.url("/studentsSearch")

        }
        $scope.students = studentList;
    })
    .controller("studentDetailsController", function ($scope, $http, $routeParams, $route) {
        $scope.$on("$routeChangeStart", (event, next, cuurrent) => {
            if (!confirm("Are you sure you want to navigate form this page - " + next.$$route.originalPath)) {
                event.preventDefault();
            }
        })
        $http({
            url: "https://jsonplaceholder.typicode.com/users",
            params: { id: $routeParams.id },
            method: "GET"

        })
            .then(data => $scope.student = data.data)
    })
    .controller("studentsSearchController", function ($scope, $http, $routeParams) {
        if ($routeParams.name) {
            $http.get("https://jsonplaceholder.typicode.com/users")
                .then(data => $scope.students = data.data.filter(student => student.name.toLowerCase().indexOf($routeParams.name) !== -1))
        } else {
            $http.get("https://jsonplaceholder.typicode.com/users")
                .then(data => $scope.students = data.data)
        }
    })