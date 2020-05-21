today = new Date();
        currentMonth = today.getMonth();
        currentYear = today.getFullYear();
        selectYear = document.getElementById("year");
        selectMonth = document.getElementById("month");
        let events_arr = [];
        let events_arr_date = [];
        let events_obj = {};

        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        monthAndYear = document.getElementById("monthAndYear");
        showCalendar(currentMonth, currentYear);


        function next() {
            currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
            currentMonth = (currentMonth + 1) % 12;
            showCalendar(currentMonth, currentYear);
        }

        function previous() {
            currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
            currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
            showCalendar(currentMonth, currentYear);
        }

        function jump() {
            currentYear = parseInt(selectYear.value);
            currentMonth = parseInt(selectMonth.value);
            showCalendar(currentMonth, currentYear);
        }

        function showCalendar(month, year) {

            let firstDay = (new Date(year, month)).getDay();

            tbl = document.getElementById("calendar-body"); // body of the calendar

            // clearing all previous cells
            tbl.innerHTML = "";

            // filing data about month and in the page via DOM.
            monthAndYear.innerHTML = months[month] + " " + year;
            selectYear.value = year;
            selectMonth.value = month;

            // creating all cells
            let date = 1;
            for (let i = 0; i < 6; i++) {
                // creates a table row
                let row = document.createElement("tr");

                //creating individual cells, filing them up with data.
                for (let j = 0; j < 7; j++) {
                    if (i === 0 && j < firstDay) {
                        cell = document.createElement("td");
                        cellText = document.createTextNode("");
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    }
                    else if (date > daysInMonth(month, year)) {
                        break;
                    }

                    else {
                        cell = document.createElement("td");
                        cellText = document.createTextNode(date);
                        // color today's date
                        let authenticated = JSON.parse('<%=reqInfo.authenticated%>');
                        if (authenticated) {
                            events_arr = '<%= myevents %>'.split(',');

                            for (let i = 0; i < events_arr.length; i++) {
                                let double = events_arr[i].split("|");
                                events_obj[double[0]] = new Date(double[1]);
                            }
                        }
                        let str = ""
                        for (let [key, value] of Object.entries(events_obj)) {
                            if (date === value.getDate() && year === value.getFullYear() && month === value.getMonth()) {
                                if (str == "") { str = key; }
                                else { str = str + ", " + key; }
                                cell.classList.add("bg-success");
                                $(cell).attr("aria-label", str)
                                $(cell).attr("role", "tooltip")
                                $(cell).attr("data-microtip-position", "bottom")
                            }
                        }
                        if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                            if ($(cell).hasClass("bg-success")) {
                                cell.classList.remove("bg-success");
                                cell.classList.add("bg-primary");
                                $(cell).attr("aria-label", "Event Today")
                                $(cell).attr("role", "tooltip")
                                $(cell).attr("data-microtip-position", "bottom")
                            }
                            else {
                                cell.classList.add("bg-info");
                                $(cell).attr("aria-label", "Today")
                                $(cell).attr("role", "tooltip")
                                $(cell).attr("data-microtip-position", "bottom")
                            }
                        }
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                        date++;
                    }


                }

                tbl.appendChild(row); // appending each row into calendar body.
            }

        }

        function daysInMonth(iMonth, iYear) {
            return 32 - new Date(iYear, iMonth, 32).getDate();
        } 