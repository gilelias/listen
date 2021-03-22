const app = angular.module('myApp', []);

app.controller('myCtrl', function ($scope, $http) {
    const wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'violet',
        progressColor: 'purple'
    });

    wavesurfer.zoom(40);
    wavesurfer.seekTo(1)

    document.body.onkeydown = function (e) {
        let j;
        switch (e.keyCode) {
            case 96: // 0
                wavesurfer.playPause();
                break;
            case 102: // 3
            case 105: // 6
                wavesurfer.play(wavesurfer.getCurrentTime() + e.keyCode - 100);
                break;
            case 97: // 1
            case 103: // 4
                j = Math.max(wavesurfer.getCurrentTime() - e.keyCode + 95, 0)
                wavesurfer.play(j);
                break;
            case 101: // 5
                j = Math.max(wavesurfer.getCurrentTime() - 1, 0)
                wavesurfer.play(j);
                break;
        }
    };


    $scope.selected_folder = null;
    $scope.selected_file = null;
    $scope.files = {};
    $scope.folders = {};




    wavesurfer.on('ready', function () {
        wavesurfer.play();
    });

    const getFolders = (select_first = false) => $http.get('/wav/').then(res => {
        if (res && res.data && res.data.folders) {
            $scope.folders = res.data.folders;
            if (select_first && $scope.folders.length > 0) {
                $scope.selected_folder = $scope.folders[0]
            }
        }
    });

    const getFiles = folder => $http.get('/wav/' + folder).then(res => {
        if (res && res.data && res.data.files) {
            $scope.files[folder] = res.data.files
        }
    });

    const getWaveUrl = (folder, file) => '/wav/' + folder + '/' + file;


    $scope.$watch('selected_folder', function () {
        if ($scope.selected_folder) {
            getFiles($scope.selected_folder);
        }
    });
    $scope.$watch('selected_file', function () {
        if ($scope.selected_folder && $scope.selected_file) {
            const wavUrl = getWaveUrl($scope.selected_folder, $scope.selected_file);
            wavesurfer.load(wavUrl);
        }
    });

    getFolders(true);
});