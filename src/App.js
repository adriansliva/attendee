import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts'
import 'react-dropdown/style.css';
import Dropdown from './components/Dropdown';

function App() {

  const [data, setData] = useState();
  const [lessonsData, setLessonsData] = useState();

  const [buildingList, setBuildingList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [lessonList, setLessonList] = useState([]);
  const [dateList, setDateList] = useState([]);

  const [building, setBuilding] = useState();
  const [room, setRoom] = useState();
  const [lesson, setLesson] = useState();
  const [date, setDate] = useState();

  const [series, setSeries] = useState();
  const [options, setOptions] = useState();

  const getDayName = (day) => {
    switch (day) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
      default:
        console.log('day not defined')
    }
  }


  useEffect(()=>{
    fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/`)
      .then((response) => response.json())
      .then((actualData) => setData(actualData));

    fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/lessons`)
      .then((response) => response.json())
      .then((actualData) => setLessonsData(actualData));
  }, []);

  useEffect(()=>{
    if(data){
      data.sort(function(x, y){
        return x.sample_time - y.sample_time;
      });

      var buildings = []

      data.forEach(element => {
        const building = element.device_data.building;
        if(buildings.indexOf(building) === -1) {
          buildings.push(building);
        }
      });

      var buildingOptions = []

      buildings.forEach(building => {
        const option = {label: building, value: building};
        buildingOptions.push(option);
      });

      setBuildingList(buildingOptions);

    }
  },[data]);

  useEffect(()=>{
    setRoom(null);
    setLesson(null);
    setDate(null);
    setRoomList([]);
    setLessonList([]);
    setDateList([]);
    if(building){
      var rooms = []

      data.forEach(element => {
        const room = element.device_data.room;
        if(rooms.indexOf(room) === -1 && element.device_data.building == building.value) {
          rooms.push(room);
        }
      });

      var roomOptions = []

      rooms.forEach(room => {
        const option = {label: room, value: room};
        roomOptions.push(option);
      });

      setRoomList(roomOptions);
    }
  },[building]);

  useEffect(()=>{
    setLesson(null);
    setDate(null);
    setLessonList([]);
    setDateList([]);
    if(room){
      var lessons = []

      lessonsData.forEach(element => {
        const lesson = {name:element.name, day: element.day, start_time: element.start_time, end_time:element.end_time}
        if(element.building == building.value && element.room == room.value) {
          lessons.push(lesson);
        }
      });

      var lessonOptions = []

      lessons.forEach(lesson => {
        const option = {label: `${lesson.name} ${lesson.day} ${lesson.start_time}-${lesson.end_time}`, value: lesson};
        lessonOptions.push(option);
      });

      setLessonList(lessonOptions);
    }
  },[room]);

  useEffect(()=>{
    setDate(null);
    setDateList([]);
    if(lesson){
      var dates = []

      data.forEach(element => {
        const date = new Date(element.sample_time);
        const dateObject = {
          year: date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
        }

        if(JSON.stringify(dates[dates.length - 1]) != JSON.stringify(dateObject) && element.device_data.building == building.value && element.device_data.room == room.value && getDayName(date.getDay()) == lesson.value.day) {
          dates.push(dateObject);
        }
      });

      var datesOptions = []

      dates.forEach(date => {
        const option = {label: `${date.day}-${date.month}-${date.year}`, value: date};
        datesOptions.push(option);
      });

      setDateList(datesOptions);
    }
  },[lesson]);

  useEffect(()=>{
    if(date){

      const diff_ins = []
      const diff_outs = []
      const times = []

      const start_date = new Date(`${date.value.year}-${date.value.month}-${date.value.day} ${lesson.value.start_time}`)
      const end_date = new Date(`${date.value.year}-${date.value.month}-${date.value.day} ${lesson.value.end_time}`)

      data.forEach(element => {
        const date = new Date(element.sample_time);
        if(date >= start_date && date <= end_date){
          diff_ins.push(element.device_data.diff_in);
          diff_outs.push(element.device_data.diff_out);
          const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
          times.push(time);
        }
      });

      setSeries([{
        name: "Diff_in",
        data: diff_ins
      },
      {
        name: "Diff_out",
        data: diff_outs
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
    }else{
      setSeries(null);
      setOptions(null);
    }
  },[date]);

  return <>
  <div className="dropdownBarQ">
    <Dropdown selected = {building && building.label} defaultLabel = {"Building"} options = {buildingList} onChange = {setBuilding}/>
    <Dropdown selected = {room && room.label} defaultLabel = {"Room"} options = {roomList} onChange = {setRoom}/>
    <Dropdown selected = {lesson && lesson.label} defaultLabel = {"Lesson"} options = {lessonList} onChange = {setLesson}/>
    <Dropdown selected = {date && date.label} defaultLabel = {"Date"} options = {dateList} onChange = {setDate}/>
    </div>
    {series && options &&
      <ReactApexChart options={options} series={series} type="line" height={350} />
    }
    
  </>
}

export default App;
