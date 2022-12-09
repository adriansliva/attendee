import {useEffect, useState} from 'react';
import ReactApexChart from 'react-apexcharts'
import 'react-dropdown/style.css';
import Dropdown from './components/Dropdown';

function App() {

    const [buildingList, setBuildingList] = useState([]);
    const [roomList, setRoomList] = useState([]);
    const [lessonList, setLessonList] = useState([]);
    const [dateList, setDateList] = useState([]);

    const [buildings, setBuildings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [dates, setDates] = useState([]);
    const [buildingDates, setBuildingDates] = useState([]);
    const [roomDates, setRoomDates] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const [building, setBuilding] = useState();
    const [room, setRoom] = useState();
    const [lesson, setLesson] = useState();
    const [date, setDate] = useState();

    const [series, setSeries] = useState();
    const [options, setOptions] = useState();

    const [pieInSeries, setPieInSeries] = useState();
    const [pieInOptions, setPieInOptions] = useState();

    const [pieOutSeries, setPieOutSeries] = useState();
    const [pieOutOptions, setPieOutOptions] = useState();

    const getDayId = (day) => {
        switch (day) {
            case "Sunday":
                return 0;
            case "Monday":
                return 1;
            case "Tuesday":
                return 2;
            case "Wednesday":
                return 3;
            case "Thursday":
                return 4;
            case "Friday":
                return 5;
            case "Saturday":
                return 6;
            default:
                console.log('day not defined')
        }
    }

    const getBuildings = () => {
        fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/buildings`)
            .then((response) => response.json())
            .then((actualData) => setBuildings(actualData));
    };

    useEffect(() => {
        getBuildings();
    }, []);

    useEffect(() => {
        if (buildings) {
            var buildingOptions = []

            buildings.forEach(building => {
                const option = {label: building, value: building};
                buildingOptions.push(option);
            });

            setBuildingList(buildingOptions);
        }
    }, [buildings]);

    useEffect(() => {
        setBuildingDates([]);
        setDates([]);
        setRooms([]);
        setRoom(null);
        if (building) {
            fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/rooms/${building.value}`)
                .then((response) => response.json())
                .then((actualData) => setRooms(actualData));

            fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/building/dates/${building.value}`)
                .then((response) => response.json())
                .then((actualData) => {
                    setDates(actualData);
                    setBuildingDates(actualData)
                });
        }
    }, [building]);

    useEffect(() => {
        if (rooms) {
            var roomOptions = []

            rooms.forEach(room => {
                const option = {label: room, value: room};
                roomOptions.push(option);
            });

            setRoomList(roomOptions);
        }
    }, [rooms]);

    useEffect(() => {
        setRoomDates([]);
        if(building) setDates(buildingDates);
        setLessons([]);
        setLesson(null);
        if (room) {
            fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/room/dates/${room.value}`)
                .then((response) => response.json())
                .then((actualData) => {
                    setDates(actualData);
                    setRoomDates(actualData)
                });

            fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/lessons/${room.value}`)
                .then((response) => response.json())
                .then((actualData) => setLessons(actualData));
        }
      }, [room]);

    useEffect(() => {
        if (lessons) {
            var lessonOptions = []

            lessons.forEach(lesson => {
                const option = {
                    label: `${lesson.name} ${lesson.day} ${lesson.start_time}-${lesson.end_time}`,
                    value: lesson
                };
                lessonOptions.push(option);
            });
            setLessonList(lessonOptions);
        }
    }, [lessons]);

    useEffect(() => {
        if(room) setDates(roomDates);
        if (lesson) {
            fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/lesson/dates/${room.value}/${getDayId(lesson.value.day)}`)
              .then((response) => response.json())
              .then((actualData) => {
                  setDates(actualData);
            });
        }
    }, [lesson]);

    useEffect(() => {
        if (dates) {
            setDate(null);
            if(!date) updateFilteredData();
            var datesOptions = []

            dates.forEach(date => {
                const option = {label: `${date.day}-${date.month}-${date.year}`, value: date};
                datesOptions.push(option);
            });

            setDateList(datesOptions);
        }
    }, [dates]);

    useEffect(() => {
        updateFilteredData();
    }, [date]);

    const updateFilteredData = () => {
        if (!date) {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
        }

        // console.log(building);
        // console.log(room);

        if (building && !room && !lesson) {
            fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/building/${date ? date.value.year : yyyy}-${date ? date.value.month : mm}-${date ? date.value.day : dd}/${building.value}`)
                .then((response) => response.json())
                .then((actualData) => setFilteredData(actualData));
        } else if (room && building && !lesson) {
            fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/room/${date ? date.value.year : yyyy}-${date ? date.value.month : mm}-${date ? date.value.day : dd}/${room.value}`)
                .then((response) => response.json())
                .then((actualData) => setFilteredData(actualData));
        } else if (lesson && building && room) {
            fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/room/${date ? date.value.year : dates[dates.length-1].year}-${date ? date.value.month : dates[dates.length-1].month}-${date ? date.value.day : dates[dates.length-1].day}/${room.value}`)
                .then((response) => response.json())
                .then((actualData) => setFilteredData(actualData));
        } else {
            setFilteredData([]);
        }
    }

    useEffect(() => {
        if (filteredData.length !== 0) {
            var deviceIds = [];
            var deviceIdsObjects = [];
            filteredData.forEach(element => {
                if(deviceIds.indexOf(element.device_id) === -1){
                    deviceIds.push(element.device_id);
                    const obj = {
                        device_id : element.device_id,
                        in: 0,
                        out: 0
                    }
                    deviceIdsObjects.push(obj);
                }
            });
            const counts = []
            var count = 0
            const times = []
            if(lesson){
                var start_date;
                var end_date;
                if(date){
                    start_date = new Date(`${date.value.year}-${date.value.month}-${date.value.day} ${lesson.value.start_time}`)
                    end_date = new Date(`${date.value.year}-${date.value.month}-${date.value.day} ${lesson.value.end_time}`)
                }else{
                    start_date = new Date(`${dates[dates.length-1].year}-${dates[dates.length-1].month}-${dates[dates.length-1].day} ${lesson.value.start_time}`)
                    end_date = new Date(`${dates[dates.length-1].year}-${dates[dates.length-1].month}-${dates[dates.length-1].day} ${lesson.value.end_time}`)
                }
                filteredData.forEach(element => {
                    const date = new Date(element.sample_time);
                    count = count + (element.device_data.diff_in - element.device_data.diff_out);
                    if(date >= start_date && date <= end_date){
                        deviceIdsObjects.forEach(obj =>{
                            if(element.device_id === obj.device_id){
                                obj.in = obj.in + element.device_data.diff_in;
                                obj.out = obj.out + element.device_data.diff_out;
                            }
                        })
                        const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                        counts.push(count);
                        times.push(time);
                    }
                });
            }else{
                filteredData.forEach(element => {
                    deviceIdsObjects.forEach(obj =>{
                        if(element.device_id === obj.device_id){
                            obj.in = obj.in + element.device_data.diff_in;
                            obj.out = obj.out + element.device_data.diff_out;
                        }
                    })
                    const date = new Date(element.sample_time);
                    count = count + (element.device_data.diff_in - element.device_data.diff_out);
                    counts.push(count);
                    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
                    times.push(time);
                });
            }

            setSeries([{
                name: "Count",
                data: counts
            }
            ])
            setOptions({
                chart: {
                    height: 350,
                    type: 'line',
                    zoom: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight'
                },
                title: {
                    text: 'Attendee',
                    align: 'left'
                },
                grid: {
                    row: {
                        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                        opacity: 0.5
                    },
                },
                xaxis: {
                    categories: times,
                }
            });

            var seriesIns = []
            var seriesOuts = []
            var options = []

            deviceIdsObjects.forEach(obj => {
                seriesIns.push(obj.in);
                seriesOuts.push(obj.out);
                options.push(obj.device_id);
            });

            setPieInSeries(seriesIns)
            setPieInOptions({
                chart: {
                  width: 380,
                  type: 'pie',
                },
                labels: options,
                title: {
                    text: 'In',
                    align: 'left'
                },
                responsive: [{
                  breakpoint: 480,
                  options: {
                    chart: {
                      width: 200
                    },
                    legend: {
                      position: 'bottom'
                    }
                  }
                }]
              })

            setPieOutSeries(seriesOuts)
            setPieOutOptions({
                chart: {
                  width: 380,
                  type: 'pie',
                },
                labels: options,
                title: {
                    text: 'Out',
                    align: 'left'
                },
                responsive: [{
                  breakpoint: 480,
                  options: {
                    chart: {
                      width: 200
                    },
                    legend: {
                      position: 'bottom'
                    }
                  }
                }]
              })
        } else {
            setSeries(null);
            setOptions(null);
            setPieInSeries(null);
            setPieInOptions(null);
            setPieOutSeries(null);
            setPieOutOptions(null);
        }
    }, [filteredData]);

    return <>
        <div className="navbarLabels">
            <ul className="liNavbarLabels">
                <li className="liNavbarLabels"><b>Building</b></li>
                <li className="liNavbarLabels"><b>Room</b></li>
                <li className="liNavbarLabels"><b>Lesson</b></li>
                <li className="liNavbarLabels"><b>Date</b></li>
            </ul>
        </div>
        <div className="dropdownBarQ">
            <Dropdown selected={building && building.label} defaultLabel={""} options={buildingList}
                      onChange={setBuilding}/>
            <Dropdown selected={room && room.label} defaultLabel={""} options={roomList} onChange={setRoom}/>
            <Dropdown selected={lesson && lesson.label} defaultLabel={""} options={lessonList} onChange={setLesson}/>
            <Dropdown selected={date && date.label} defaultLabel={""} options={dateList} onChange={setDate}/>
        </div>
        <div>
            {series && options &&
                <ReactApexChart options={options} series={series} type="line" height={350}/>
            }
            <div className="piecharts">
                {pieInSeries && pieInOptions &&
                        <ReactApexChart options={pieInOptions} series={pieInSeries} type="pie" width={380} />
                }
                {pieOutSeries && pieOutOptions &&
                        <ReactApexChart options={pieOutOptions} series={pieOutSeries} type="pie" width={380} />
                }
            </div>
        </div>

        {/*series && options && room && !lesson && <div>
            <ReactApexChart options={options} series={series} type="line" height={350}/>
            <div className="piecharts">
                <ReactApexChart options={options} series={series[0].data} type="pie" height={350} width={300}/>
                <ReactApexChart options={options} series={series[0].data} type="pie" height={350} width={300}/>
            </div>

        </div>

    */}
        <div className='indexFrame'>
            <div className="row row-cols-1 row-cols-md-3 g-4">

                {!building && !room && !lesson &&
                buildingList.map(building => (
                    // <div class="col">{building.value}</div>
                    <div className="col" key={building.value}>
                        <div className="card w-50">
                            <img src="https://www.iconpacks.net/icons/1/free-building-icon-1062-thumb.png"
                                 className="card-img-top" alt="..."></img>
                            <div className="card-body">
                                <h5 className="card-title">{building.value}</h5>
                                <p className="card-text">There will be number of people inside</p>
                            </div>
                        </div>
                    </div>
                ))
                }
            </div>
        </div>
    </>
}

export default App;
