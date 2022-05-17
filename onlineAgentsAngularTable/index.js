angular
    .module('widget', ['ngMaterial', 'ngMessages', 'ngCookies', 'angular-toasty', 'ngSanitize', 'md.data.table'])
    .config(['toastyConfigProvider', function (toastyConfigProvider) {
        toastyConfigProvider.setConfig({
            position: 'top-right',
            sound: false,
            html: true,
            theme: 'material',
            limit: 1
        });
    }])
    .controller('widgetController', function ($http, $cookies, $location, $mdDialog, toasty, $timeout, $interval) {

        var vm = this;

        // Functions
        vm.onInit = onInit;

        // Variables

        // START CUSTOM DATA VARIABLES

        // Title
        vm.title = 'Agents';

        // Data retrieve interval (in seconds)
        vm.interval = 10;

        // API URL
        vm.url = "https://myserver.com/api/rpc/agents";

        // API params
        vm.params = [
          {
           column: 'id',
           alias: 'ID'
          }, {
            column: 'name',
            alias: 'Name'
          }, {
            column: 'online',
            alias: 'Online'
          }, {
            column: 'voicePause',
            alias: 'Paused'
          }
        ];

        // Motion Token
        vm.token = $cookies.get('motion.token');

        // END CUSTOM DATA VARIABLES

        // Table content
        vm.data = {
          count: 0,
          rows: []
        };

        vm.query = {
          limit: 10,
          page: 1
        };

        function onInit() {
            getData();
            $interval(getData,vm.interval*1000);
        }

        // Get data from API, example
        function getData() {
            $http({
                    method: 'GET',
                    url: vm.url,
                    headers: {
                       'Content-Type': 'application/json',
                       'Authorization': 'Bearer ' + vm.token
                    },
                    data: {},
                    params: {}
                })
                .then(function (res) {
                  if(res && res.data){
                    vm.data.rows = _.filter(res.data.rows, {online: true});
                    vm.data.count = vm.data.rows.length;
                  }
                })
                .catch(function (err) {
                  toasty.error({
                      title: 'Error',
                      msg: 'Unable to retrieve data, check browser console for info.'
                  });
                  console.log(err);
                });
        }

        $timeout(function() {
          onInit();
        });
    });
