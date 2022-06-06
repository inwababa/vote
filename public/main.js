const form = document.getElementById('vote-form');

//Form Submit event
form.addEventListener('submit', (e) =>{
    
    const choice = document.querySelector('input[name=os]:checked').value;
    const data = {os: choice};

    fetch('http://localhost:3000/poll',{
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));

    e.preventDefault();
});

fetch("http://localhost:3000/poll")
    .then(res => res.json())
    .then(data => {
        let votes = data.votes;
        let totalVotes = votes.length;
        //document.querySelector('#chartTitle').textContent = `Total Votes: ${totalVotes}`;

        //Count vote Points

       const voteCounts = votes.reduce((acc, vote) => (
            (acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points)), acc),
            {}
        );

        let dataPoints = [
            { label: 'Windows', y: voteCounts.Windows },
            { label: 'MacOS', y: voteCounts.MacOS },
            { label: 'Linux', y: voteCounts.Linux },
            { label: 'Other', y: voteCounts.Other }
        ];
            
        const chartContainer = document.querySelector('#chartContainer');
        
        if(chartContainer){
            
            const chart = new CanvasJS.Chart('chartContainer', {
                animationEnabled: true,
                theme: 'theme1',
                title: {
                    text: `Total Votes ${totalVotes}`
                },
                data:[
                    {
                        type: 'column',
                        dataPoints: dataPoints
                    }
                ]
            });
            chart.render();
        
             // Enable pusher logging - don't include this in production
             Pusher.logToConsole = true;

             var pusher = new Pusher('f87edce7a3555e4a5d09', {
               cluster: 'us2',
               encrypted: true
             });
         
             var channel = pusher.subscribe('os-poll');

             channel.bind('os-vote', function(data) {
               dataPoints = dataPoints.map(x => {
                   if(x.label == data.os) {
                       x.y += data.points;
                       return x;
                   }else{
                       return x;
                   }
               })
               chart.render();
             });
        }

});