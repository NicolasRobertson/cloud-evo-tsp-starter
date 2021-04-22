(function evoTSPwrapper($) {

    const baseUrl = 'https://h7a2o93em4.execute-api.us-east-1.amazonaws.com/prod'
    console.log(`The base URL is ${baseUrl}.`);

    $(function onDocReady() {
        $('#generate-random-routes').click(randomRoutes);
        $('#get-best-routes').click(getBestRoutes);
        $('#get-route-by-id').click(getRouteById);
    });

    function randomRoute(runId, generation) {
        $.ajax({
            method: 'POST',
            url: baseUrl + '/routes',
            data: JSON.stringify({
                runId: runId,
                generation: generation
            }),
            contentType: 'application/json',

            success: showRoute,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error(
                    'Error generating random route: ', 
                    textStatus, 
                    ', Details: ', 
                    errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occurred when creating a random route:\n' + jqXHR.responseText);
            }
        })
    }

    function randomRoutes(event) {
        const runId = $('#runId-text-field').val();
        const generation = $('#generation-text-field').val();
        const numToGenerate =$('#num-to-generate').val();

        $('#new-route-list').text('');

        async.times(numToGenerate, () => randomRoute(runId, generation));
    }

    function showRoute(result) {
        console.log('New route received from API: ', result);
        const {routeId,length} = result;
        $('#new-route-list').append(`<li>We generated route ${routeId} with length ${length}.</li>`);
    }

    function getBestRoutes() {
        const runId = $('#runId-text-field').val();
        const generation = $('#generation-text-field').val();
        const numToReturn = $('#num-best-to-get').val();

        $('#best-route-list').text('');

        console.log("Run Id" + runId + "generation")
        $.ajax({
            method: 'GET',
            url: baseUrl + `/best?runId=${runId}&generation=${generation}&numToReturn=${numToReturn}`,
            contentType: 'application/json',

            success: showBestRoute,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error(
                    'Error generating best routes: ', 
                    textStatus, 
                    ', Details: ', 
                    errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occurred when best routes:\n' + jqXHR.responseText);
            }
        })
    }

    function showBestRoute(result) {
        console.log('Best route received from API: ', result);
        result.forEach(element => {
            const {routeId,length} = element;
            $('#best-route-list').append(`<li>We got best route ${routeId} with length ${length}.</li>`);
        });
    }

    function getRouteById() {
        const routeId = $('#route-ID').val();

        $.ajax({
            method: 'GET',
            url: baseUrl + `/routes/${routeId}`,
            contentType: 'application/json',

            success: showRouteById,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error(
                    'Error retrieving route: ', 
                    textStatus, 
                    ', Details: ', 
                    errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occurred when retrieving route:\n' + jqXHR.responseText);
            }
        })
    }

    function showRouteById(result) {
        console.log('Route received from API: ', result);
        const {routeId,generation,length,partitionKey,route,runId} = result;
        $('#route-by-id-elements').append(`<li>We got route ${routeId} with length ${length}, generation ${generation}, partitionKey ${partitionKey}, route ${route}, runId ${runId}.</li>`);
    }

}(jQuery));
