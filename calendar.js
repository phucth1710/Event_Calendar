(function(){Date.prototype.deltaDays=function(c){return new Date(this.getFullYear(),this.getMonth(),this.getDate()+c)};Date.prototype.getSunday=function(){return this.deltaDays(-1*this.getDay())}})();
function Week(c){this.sunday=c.getSunday();this.nextWeek=function(){return new Week(this.sunday.deltaDays(7))};this.prevWeek=function(){return new Week(this.sunday.deltaDays(-7))};this.contains=function(b){return this.sunday.valueOf()===b.getSunday().valueOf()};this.getDates=function(){for(var b=[],a=0;7>a;a++)b.push(this.sunday.deltaDays(a));return b}}
function Month(c,b){this.year=c;this.month=b;this.nextMonth=function(){return new Month(c+Math.floor((b+1)/12),(b+1)%12)};this.prevMonth=function(){return new Month(c+Math.floor((b-1)/12),(b+11)%12)};this.getDateObject=function(a){return new Date(this.year,this.month,a)};this.getWeeks=function(){var a=this.getDateObject(1),b=this.nextMonth().getDateObject(0),c=[],a=new Week(a);for(c.push(a);!a.contains(b);)a=a.nextWeek(),c.push(a);return c}};

let curr = new Date();
let currentMonth = new Month(curr.getFullYear(), curr.getMonth()); 
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let username = null; 
let currentDateToAddEvent = null;
let token = null;

// Check if a user is still signed in after refreshing page
document.addEventListener("DOMContentLoaded", function(event) {
    fetch('checkLogin.php')
    .then(response => response.json())
    .then(response => {
        if(response.success){
            //keep user log in
            console.log("User still log in");
            username = response.username;
            token = response.token;
            updateCalendar();
            $("#message").text(`Welcome back, ${username}!`);
            $("#sign-up").hide();
            $("#log-in").hide();
            $(".add_event_btn").show();
            displayEvent();

            //show logout btn
            $("#logout_div").show();
            //show share btn
            $("#share_div").show();
        }
        else{
            console.log("Not log in");
        }
    })
    .catch(err => console.error(err));
});

/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

//create the calendar of specific month
function createCalendar(){
    let currentMonthYear = months[currentMonth.month].bold() + " " + currentMonth.year;
    $("#current-month-year").html(currentMonthYear);   
	let weeks = currentMonth.getWeeks();
	
	for(let w in weeks){
        let tableRow = document.createElement("tr");
		let days = weeks[w].getDates();
		
		for(let d in days){
            let element = document.createElement("td");
            element.id = `${days[d].getFullYear()}-${formatDateAndMonth(days[d].getMonth() + 1)}-${formatDateAndMonth(days[d].getDate())}` ;
            let btnAddEvent = document.createElement("button");
            btnAddEvent.classList.add("add_event_btn");
            btnAddEvent.innerHTML = "+";

            let dateVal = document.createElement("p");
            dateVal.innerHTML = days[d].getDate();
            // console.log(days[d].getDate());
            // console.log(days[d].getMonth());
            // console.log(days[d].getFullYear());
            // console.log(days[d]);

            element.appendChild(dateVal);
            element.appendChild(btnAddEvent);
            tableRow.appendChild(element);
        }
        document.getElementsByTagName('table')[0].appendChild(tableRow);
    }
    $(".add_event_btn").hide();
    $(".newEvent").hide();
    addEventButton();
}

//update calendar after going to the next/previous month
function updateCalendar() {
    $("table").children()
    .not(':first-child')
    .remove();       
    createCalendar();
}

createCalendar();

//format to YYYY-MM-DD (1 -> 01, 2 -> 02, etc)
function formatDateAndMonth(value){
    return value < 10 ? "0" + value : value.toString();
}

/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

//login user in
$("#login_btn").click(function (e) {
    e.preventDefault();    
    const pathToPhpFile = 'login.php'; 
    username = $("#login_username").val();
    const password = $("#login_password").val();

    const data = { "username": username, "password": password };
    // console.log(data);

    fetch(pathToPhpFile, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(response => {
        if(response.success){
            $("#message").text(`Welcome back, ${response.fullname}!`);
            $("#sign-up").hide();
            $("#log-in").hide();
            $(".add_event_btn").show();
            token = response.token
            displayEvent();

            //show logout btn
            $("#logout_div").show();
            //show share btn
            $("#share_div").show();
        }
        else{
            username = null;
            $("#message").text(`${response.message}`);
        }
        console.log(response.success ? `You've logged in! Hello ${response.fullname}` : `Log In Unsuccessfully${response.message}`);
    })
    .catch(err => console.error(err));
});

/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

//display all events in a month
function displayEvent(){
    let beginDate = $(".add_event_btn").first().parents()[0].id;
    let endDate = $(".add_event_btn").last().parents()[0].id;
    const date = { "begin": beginDate, "end": endDate, "token" : token};
    console.log(date);
    fetch("displayEvent.php", {
        method: "POST",
        body: JSON.stringify(date),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(response => {
        console.log(response);
        if(response.success){
            let allTitle = response['title'];
            let allDate = response['date'];
            let allTime = response['time'];
            let allEventID = response['event_id'];
            let allOnwer = response["owner"]
            // console.log(document.getElementById(allDate[0]));
    
            for(let i = 0; i < allDate.length; i++){
                addDivEvent(allTitle[i], allDate[i], allTime[i], allEventID[i], allOnwer[i]);
            }
            deleteEventButton();
            editEventButton();
        }
        else{
            $("#message").text(`${response.message}`);
        }
    })
    .catch(err => console.error(err));
}

//Add the delete and update btn to every event. Get called in displayEvent and after inserting new event
function addDivEvent(title, date, time, event_id, owner){
    let divEvent = document.createElement("ul");
            
    let title_dom = document.createElement("li");
    title_dom.innerHTML = owner.bold() + ": " + title + " (" + time.substring(0, time.length - 3) + ")";
    divEvent.appendChild(title_dom);

    let editBtn = document.createElement("button");
    editBtn.innerHTML = "Edit";
    editBtn.classList.add("edit-event-btn");
    divEvent.appendChild(editBtn);

    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "x";
    // deleteBtn.classList.add("delete-event-btn");
    deleteBtn.setAttribute("class", "delete-event-btn");
    divEvent.appendChild(deleteBtn);

    var event_id_dom = document.createElement("input");
    event_id_dom.setAttribute("type", "hidden");
    event_id_dom.setAttribute("name", "event_id");
    event_id_dom.setAttribute("value", event_id);
    divEvent.appendChild(event_id_dom);

    document.getElementById(date).appendChild(divEvent);
}

//Go to next month
$("#next_month_btn").click(function (e) { 
    e.preventDefault();
    currentMonth = currentMonth.nextMonth();
    updateCalendar();
    displayEvent();
    if(token != null){
        $(".add_event_btn").show();
        //Search for username's events in Event table and display all of them
    }
});

//Go to previous month
$("#prev_month_btn").click(function (e) { 
    e.preventDefault();
    currentMonth = currentMonth.prevMonth();
    updateCalendar();
    displayEvent();
    if(token != null){
        $(".add_event_btn").show();
        //Search for username's events in Event table and display all of them
    }
});

/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//add event 

//If user click on + and add event -> show the add event box
function addEventButton(){
    $(".add_event_btn").click(function (e) { 
        e.preventDefault();
        let caller = e.target || e.srcElement;
        currentDateToAddEvent = caller.parentNode.id;
        console.log(currentDateToAddEvent);
        // $(".newEvent").css("display", "block");
        $(".newEvent").show();
    });
}


//submit/add event to database
$("#add_event").click(function (e) { 
    e.preventDefault();
    const event_title = $("#event_title").val();
    const event_date = currentDateToAddEvent;
    const event_time = $("#event_time").val() + ":00";
    const participants = $("#participant").val(); 
    const pathToPhpFile = 'addEvent.php'; 
    const data = {"event_title": event_title, "event_date": event_date, "event_time": event_time , "participants": participants, "token" : token};
    console.log(data);
    fetch(pathToPhpFile, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(response => {
        console.log(response);
        if(response.success){
            addDivEvent(event_title, currentDateToAddEvent, event_time, response['event_id'], username);
            deleteEventButton();
            editEventButton();
            $(".newEvent").hide();
        }
        else{
            $("#message").text(`${response.message}`);
        }
        
    })
    .catch(err => console.error(err));
});

//Turn of the add event box
$(".close-new-event-btn").click(function (e){
    $(".newEvent").hide();
});

/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//Edit event 

let event_id_to_edit = null;
let paragraph_to_edit = null;

//If user click on "Edit"  -> show the Edit event box
function editEventButton(){
    $(".edit-event-btn").click(function (e) { 
        e.preventDefault();
        let caller = e.target || e.srcElement;
        event_id_to_edit = $(caller).siblings('input').val();
        paragraph_to_edit = $(caller).siblings('li')[0];
        currentDateToAddEvent = caller.parentNode.parentNode.id;
        // console.log(caller.parentNode);
        $(".editEvent").show();
    });
}

//Close Edit event box
$(".close-edit-event-btn").click(function (e){
    $(".editEvent").hide();
});

//Edit event and save changes to database
$("#edit_event").click(function (e) { 
    e.preventDefault();
    const event_title = $("#edit_event_title").val();
    const event_date = currentDateToAddEvent;
    const event_time = $("#edit_event_time").val() + ":00";
    const pathToPhpFile = 'edit.php'; 
    const data = {"event_title": event_title, "event_date": event_date, "event_time": event_time , "event_id" : event_id_to_edit, "token" : token};
    // console.log(data);
    fetch(pathToPhpFile, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(response => {
        if(response.success){
            console.log(paragraph_to_edit);
            paragraph_to_edit.innerHTML = (event_title + " (" + event_time.substring(0, event_time.length - 3) + ")");
            $(".editEvent").hide();
        }
        else{
            $("#message").text(`${response.message}`);
        }
        
    })
    .catch(err => console.error(err));
});

/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

//delete event from database
function deleteEventButton(){
    $(".delete-event-btn").click(function(e){
        let event_id = $(e.target).siblings('input').val();
        let data = {"event_id": event_id, "token" : token};
        fetch("delete.php", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            if(response.success){
                $(e.target).parent().remove();
            }
            else{
                $("#message").text(`${response.message}`);
            }
        })
        .catch(err => console.error(err));
    });
}

/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//logout 
$("#logout_btn").click(function(e){
    fetch("logout.php")
    .then(response => response.json())
    .then(response => {
        username = null; 
        currentDateToAddEvent = null;
        token = null;
        $("#logout_div").hide();
        $("#log-in").show();
        $("#sign-up").show();
        updateCalendar();
        $("#login_username").val("");
        $("#login_password").val("");
        $("#signup_fullname").val("");
        $("#signup_email").val("");
        $("#signup_username").val("");
        $("#signup_password").val("");

        $('#message').html(
            "Cloud Calendar"
        );
    })
    .catch(err => console.error(err));
});

//Creative portion

/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

//Share all Events to friend
$("#share_btn").click(function(e){
    e.preventDefault();
    const shared_user = $("#shared_user").val();
    const data = {"shared_user": shared_user, "token" : token };
    fetch("shared_events.php", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(response => {
        console.log(response)
        if(response.success){
            $("#shared_user").val("");
        }
        else{
            $("#message").text(`${response.message}`);
        }
    })
    .catch(err => console.error(err));
});