//Calendar functions

const monthYearElement = document.getElementById('monthYear');
const datesElement = document.getElementById('dates');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentDate = new Date();

const updateCalendar = () =>{
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const today=new Date()
    const currentDateToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth +1, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();

    const monthYearString = currentDate.toLocaleString('default', {month: 'long', year: 'numeric'});
    monthYearElement.textContent=monthYearString

    let datesHTML = '';

    for (let i = firstDayIndex; i>0; i--){
        datesHTML+=`<div> </div>`;
    }

    for (let i = 1; i <=totalDays; i++){
        const date = new Date(currentYear, currentMonth, i);
        const isPast = date < currentDateToday;
        const sunday = date.getDay() === 0;
        var activeClass;
        if (date.toDateString()=== new Date().toDateString() && !isPast){
            activeClass="active";
        } else if (!isPast && !sunday){
            activeClass="inactive";
        } else{
            activeClass=""
        }
        const notAvailClass = isPast ? "notavail" : "" || sunday ? "notavail" : "";

        datesHTML+=`<div class="date ${activeClass} ${notAvailClass}">${i}</div>`;
    }

    datesElement.innerHTML = datesHTML;

    document.querySelectorAll(".date").forEach(date=>{
        date.addEventListener("click", function() {
            if (!this.classList.contains("notavail")){
                document.querySelectorAll('.date').forEach(d => d.classList.remove("active"));
                this.classList.add("active");
            }
        })
    })

}

const updateTimes = () => {
    times = ["7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
        "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"
    ]
    timeList = ''
    for (let i=0; i<times.length; i++){
        const activeStatus = i===0 ? "activeTime" : "inactiveTime";
        timeList+=`<button class="time ${activeStatus}">${times[i]}</button>`;
    }
    console.log(timeList)

    document.getElementById("timesList").innerHTML = timeList;

    document.querySelectorAll(".time").forEach(t=>{
        t.addEventListener("click", function() {
            document.querySelectorAll(".time").forEach(ti => ti.classList.remove("activeTime"))
            this.classList.add("activeTime");
        })
    })
}
updateTimes();

prevBtn.addEventListener('click', ()=>{
    const today=new Date()
    const currentDateToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (currentDateToday.getMonth()<=(currentDate.getMonth()-1)){
        currentDate.setMonth(currentDate.getMonth()-1);
        updateCalendar();
    } 

})

nextBtn.addEventListener('click', ()=>{
    currentDate.setMonth(currentDate.getMonth()+1);
    updateCalendar();
})

updateCalendar();

//page visibility

function toggleVisibility(event, tab){
    document.querySelectorAll("section").forEach(section=>{
        if (section.classList.contains("visible")){
            section.classList.remove("visible")
            section.classList.add('invisible')
            
        }
        if (section.id===tab){
            section.classList.remove("invisible")
            section.classList.add("visible")
        }
    })

    document.querySelectorAll("a").forEach(item =>{
        if (item.classList.contains("disabled")){
            item.classList.remove("disabled")
            item.classList.add("active")
        }
        if (item.id===tab){
            item.classList.remove("active")
            item.classList.add("disabled")
        }
    })
}

function selectService(event, tab){
    var listOfTabs = ["trainingSession", "programPlanning", "nutritionAdvice"]
    listOfTabs = listOfTabs.filter(function(item){
        return item!==tab
    })
    const wanted = document.getElementById(tab);
    wanted.classList.remove("unselected")
    wanted.classList.add("selected")

    console.log(listOfTabs)

    for (let i=0; i<listOfTabs.length; i++){
        const element = document.getElementById(listOfTabs[i]);
        element.classList.remove("selected");
        element.classList.add("unselected")
    }

}

function toBookNow(event, choice){
    toggleVisibility(event, 'book');
    var listOfTabs = ["trainingSession", "programPlanning", "nutritionAdvice"]
    listOfTabs = listOfTabs.filter(function(item){
        return item!==choice
    })
    
    for (let i=0; i<listOfTabs.length; i++){
        const element = document.getElementById(listOfTabs[i]);
        element.classList.remove("selected");
        element.classList.add("unselected")
    }
    const wanted = document.getElementById(choice);
    wanted.classList.remove("unselected")
    wanted.classList.add("selected")
    
}

function confirm(event){
    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const email = document.getElementById("email").value;
    var time;
    var date;
    var month;
    var year;

    document.querySelectorAll('button.time').forEach((h6)=> {
        if (h6.classList.contains("activeTime")){
            time=h6.innerHTML;
        }
    })
    console.log(time)

    document.querySelectorAll(".date").forEach((d)=>{
        if (d.classList.contains("active")){
            date=d.textContent;
        }
    })

    if (date==="1"){
        date+="st"
    } else if (date=="2"){
        date+="nd"
    } else if (date=="3"){
        date+="rd"
    } else{
        date+="th"
    }

    const monthYear = document.querySelector(".monthYear").textContent
    const splitMonthYear = monthYear.split(" ")
    month = splitMonthYear[0];
    year = splitMonthYear[1];

    var thankyou="THANK YOU";
    if (fname!==""){
        thankyou += " " + fname.toUpperCase();
    }
    thankyou+="!"

    var sessionClass = document.querySelector(".selected");
    console.log(sessionClass.id)
    var session;
    if (sessionClass.id==="programPlanning"){
        session="program consultation"
    } else if (sessionClass.id==="trainingSession"){
        session="training session"
    } else{
        session="nutrition consultation"
    }


    document.getElementById("bookedSessionName").innerHTML = thankyou;
    var confirmation = `Looking forward to our ${session} on ${month} ${date}, ${year} at ${time}`
    document.getElementById("bookedSessionDetails").innerHTML = confirmation;

    toggleVisibility(event, "Confirmation")
}



