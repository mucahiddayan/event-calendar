/**
 * @author Mücahid Dayan
 * @description AngularJS Event Calendar Module with Scheduler
 * 
 */



/* angularjs init */

const eventCalendarDependencies = [];
const eventCalendar = angular.module('eventCalendar', eventCalendarDependencies);

eventCalendar.controller('eventCalendarMainController', ['$scope', ($scope) => {

}]);

eventCalendar.directive('eventCalendarScheduler', [() => {
    let link = (scope, element, attributes) => {
        console.log('Scheduler created');
    }

    let template = (element, attributes) => {
        return `
            <h1>Scheduler</h1>
        `;
    }
    return {
        restrict: 'EA',
        scope: {},
        link,
        template
    };
}]);

eventCalendar.directive('calendar', [() => {
    let link = (scope, element, attributes) => {
        let createDaysArray = daysInMonth => {
            let days = [];
            for (let i = 0; i < daysInMonth; i++) {
                days.push(i+1);
            }
            return days;
        }

        let init = () => {
            scope.today = moment();
            scope.daysInMonth = createDaysArray(scope.today.daysInMonth());
            console.log(scope.daysInMonth);
        }

        init();
    }

    let template = (element, attributes) => {
        return `
            <div class="event-calendar-wrapper">
            <div class="event-calendar-view">
                <div class="days" ng-repeat="day in daysInMonth track by $index">
                    <span ng-bind="day"></span>
                </div>
            </div>
            </div>
        `;
    }

    return {
        restrict: 'EA',
        scope: {

        },
        link,
        template,
    };
}]);