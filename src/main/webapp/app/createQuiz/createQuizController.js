museumApp.controller('createQuizController',
    ['$scope','$location', 'apiService', '$rootScope','apiService',    
    function($scope, $location, apiService, $rootScope, apiService){
    
    var stats = {};    
    $scope.init = function(){
        if($rootScope.currentUser && $rootScope.currentUser.quiz !== undefined){
            $scope.allStatsObjs = [];
            $scope.questions    = [];
            var url = $location.url();

            if(url.indexOf('manageQuiz') > -1){  
                $scope.createNew = false;
                var l = $rootScope.currentUser.quiz.length; 

                for(var i=0; i < l; i++){
                    if($rootScope.currentUser.quiz[i].id === $rootScope.currentUser.activeQuiz){
                        $scope.quiz = $rootScope.currentUser.quiz[i];
                    } 
                }
                apiService.getQuestions($rootScope.currentUser.activeQuiz).then(
                        function(res){
                            $scope.questions = res.data;
                        
                            apiService.getQuizStatistics($rootScope.currentUser.activeQuiz).then(
                                function(res){
                                   stats = res.data; 
                                    //Create stats objects from the fetched statistics and questions
                                    createStatsObjs();
                                });
                        },function(err){
                });
            }else{
                $scope.createNew = true;
            }
        }   
    };
    
    function createStatsObjs(){
        for(var i=0; i < $scope.questions.length; i++){
            var q     = $scope.questions[i];
            var q_ops = q.options;
            
            var obj = new StatsObj(q.question);
            
            for(var j=0;j<q_ops.length;j++){
                obj.labels.push(q_ops[j].text);
                if(stats[q_ops[j].id]){
                    obj.noData = false;
                   obj.data.push(stats[q_ops[j].id]);
                }else{
                   obj.data.push(0); 
                }
            }
            $scope.allStatsObjs.push(obj);
        }
    }
    
    function StatsObj(questionLabel){
        return {
                questionLabel   : questionLabel,
                labels          : [],
                data            : [],
                noData          : true
            };
    }

    
    $scope.routeToQuestion = function(question){
        var address;
        
        if(question){
            $rootScope.currentUser.activeQuestion = question;
            address = $location.url() + '/question/' + question.id;
        }else{
            $rootScope.currentUser.activeQuestion=undefined;
            address = $location.url() + '/addQuestion';
        }
        
        $location.path(address); 
    };
    
    $scope.submitQuiz = function(){
        var url = $location.url();
        if(url.indexOf('manageQuiz') > -1){
            apiService.editQuiz($scope.quiz.name, 
                    $scope.quiz.points +'', 
                    $scope.quiz.description, 
                    $rootScope.currentUser.activeQuiz);
        }else{
            apiService.addQuiz($scope.quiz.name, $scope.quiz.points, $scope.quiz.description,function(){
                backToAdminPage();
            });
        }
        
        
    };
    
    $scope.cancel = function(){
        $rootScope.currentUser.activeQuiz = "";
        backToAdminPage()
    };
    
    function backToAdminPage(){
        $location.path('admin');
    }
    
}]);
