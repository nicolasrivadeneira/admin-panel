angular.module('adminPanel').directive('apAccordion', [
    '$timeout', '$rootScope',
    function ($timeout, $rootScope) {
        return {
            require: 'ngModel',
            restrict: 'AE',
            transclude: true,
            scope: {
                allowAllClosed: '=',
                multiExpand: '=',
                addButtonText: '@?',
                name: '@?',
                askDelete: '=?',
                title: '@?',
                text: '@?'
            },
            link: function (scope, elem, attr, ngModel) {
                elem.addClass('ap-accordion');

                scope.accordion = new Foundation.Accordion(elem.find('.accordion'), {
                    'data-multi-expand': scope.multiExpand,
                    'data-allow-all-closed': scope.allowAllClosed
                });

                scope.addElement = function () {
                    var obj = {};
                    var name = (scope.name) ? scope.name : 'default';
                    scope.$emit('ap.accordion.add', obj, name);
                    if (!angular.isUndefined(ngModel.$modelValue)) {
                        ngModel.$modelValue.push(obj);
                    }
                };

                scope.removeElement = function (object) {
                    scope.$emit('ap.accordion.remove', object);
                    var array = ngModel.$modelValue;
                    var index = array.indexOf(object);
                    if (scope.askDelete) {
                        $rootScope.$broadcast('ap-confirm-modal:show', {
                            title: scope.title ? scope.title : "Eliminar",
                            text: scope.text ? scope.text : "Esta seguro que desa eliminar?",
                            fn: scope.fn(array, index)
                        });
                    } else {
                        if (index > -1) {
                            array.splice(index, 1);
                        }
                    }

                };

                scope.fn = deleteFunction;

                function deleteFunction(array, index) {
                    return function () {
                        if (index > -1) {
                            array.splice(index, 1);
                        }
                    };
                }

                //Init al finalizar el ciclo digest actual
                $timeout(function () {
                    if (angular.isUndefined(ngModel.$modelValue)) {
                        scope.$apply(function () {
                            ngModel.$setViewValue([]);
                        });
                    }
                });
            },
            controller: ['$scope', function ($scope) {
                    this.toggleTab = function (tab) {
                        $scope.accordion.$element.foundation('toggle', tab);
                    };

                    this.removeElement = function (object) {
                        $scope.removeElement(object);
                    };

                    this.reInitComponent = function () {
                        $scope.accordion.$element.foundation('up', $scope.accordion.$tabs.find('.accordion-content'));
                        Foundation.reInit($scope.accordion.$element);
                    };
                }],
            templateUrl: 'directives/accordion/accordion.template.html'
        };
    }
]);
