window.projects = [];
window.page = 0;
window.pageSize = 10;

$(function() {
    let updateProjectList = (projects) => {
        $("#active-projects .table-item:not(.template)").remove();
        projects.forEach(project => {
            let node = $("#active-projects .table-item.template").clone().removeClass("template").insertAfter($("#active-projects .table-item:last"));
            let shootdate = project["Shoot Date"];
            node.find("[shoot-date]").text(shootdate?moment(shootdate).format("MM/DD/YYYY"):"");
            node.find("[project-name]").text(project["Project"]).attr("href", "/search.php?filterSag=SAG%2BNU," + project["Union Status"] + "&projectID=" + project["id"] + "&viewType=projectDetail");
            node.find("[add-button]").attr("href", "/search.php?filterSag=SAG%2BNU," + project["Union Status"] + "&projectID=" + project["id"] + "&viewType=addToProject");
            node.find("[payroll]").text(project["Payroll Company Name"]??"");
            node.find("[rate-union]").text("$" + project["Base Rate"] + "/" + project["Hours"] + "hrs " + project["Union Status"]);
            node.find("[project-status]").text(project["Project Status"]||"Active");
            
            let available = parseInt(project["Statuses"]["Available"]||"0");
            node.find("[confirmed]:eq(0)").text(available + " AVAILABLE");
            let bookingConfirmed = parseInt(project["Statuses"]["Booking Confirmed"]||"0");
            node.find("[confirmed]:eq(1)").text(bookingConfirmed + " BOOKED");
            let finalDetailsConfirmed = parseInt(project["Statuses"]["Final Details Confirmed"]||"0");
            node.find("[confirmed]:eq(2)").text(finalDetailsConfirmed + " CONFIRMED");

            let unavailable = parseInt(project["Statuses"]["Unavailable"]||"0");
            node.find("[denied]:eq(0)").text(unavailable + " UNAVAILABLE");
            let bookingDeclined = parseInt(project["Statuses"]["Booking Declined"]||"0");
            node.find("[denied]:eq(1)").text(bookingDeclined + " DENIED");
            let emergency = parseInt(project["Statuses"]["Emergency"]||"0");
            node.find("[denied]:eq(2)").text(emergency + " EMERGENCY");

            let availabilityCheckSent = parseInt(project["Statuses"]["Availability Check Sent"]||"0");
            node.find("[unanswered]:eq(0)").text(availabilityCheckSent + " UNANSWERED");
            let bookingEmailSent = parseInt(project["Statuses"]["Booking Email Sent"]||"0");
            node.find("[unanswered]:eq(1)").text(bookingEmailSent + " UNANSWERED");
            let finalDetailsSent = parseInt(project["Statuses"]["Final Details Sent"]||"0");
            node.find("[unanswered]:eq(2)").text(finalDetailsSent + " UNANSWERED");

            if(available + unavailable + availabilityCheckSent != 0) node.find(".status-available").addClass("active");
            else node.find(".status-available").removeClass("active");

            if(bookingConfirmed + bookingDeclined + bookingEmailSent != 0) node.find(".status-booked").addClass("active");
            else node.find(".status-booked").removeClass("active");

            if(finalDetailsSent + finalDetailsConfirmed + emergency != 0) node.find(".status-finalnotessent").addClass("active");
            else node.find(".status-finalnotessent").removeClass("active");

            //Project status change action buttons
            node.find("[more-button] .btn-more").click(function() {
                node.find("[more-button] .btn-more>div").removeClass("displayNone");
            });
            node.find("[more-button] .btn-more").blur(function() {
                node.find("[more-button] .btn-more>div").addClass("displayNone");
            });
            node.find("[more-button] .btn-more>div>div.status-item").click(function() {
                event.stopPropagation();
                node.find("[more-button] .btn-more>div").addClass("displayNone");
                switch($(this).text()) {
                    case "Active":
                        break;
                    case "Billed":
                        if(project["Project Status"]!="Billed") {
                            $(".billing-dialog").removeClass("displayNone");
                            $(".billing-dialog input[name='projectID']").val(project["id"]);
                            $(".billing-dialog #billing_type_percent").prop("checked", true);
                            $(".billing-dialog input[name='value']").val("");
                        } else {
                            location.href = `/billing.php?projectID=${project["id"]}`;
                        }
                        break;
                    case "Cancelled":
                        break;
                }
            });
        });
    }
    $(".billing-dialog .container").on("click", function(event) {
        event.stopPropagation();
    });
    $(".billing-dialog").on("click", function() {
        $(".billing-dialog").addClass("displayNone");
    })
    let updatePagination = (projects, pagerOffset = 0, pagerSize = 5, back = false) => {
        $(".page").remove();
        let pageCount = Math.ceil(projects.length / window.pageSize);
        for(let i=pagerOffset; i<Math.min(pagerOffset + pagerSize, pageCount); i++) {
            $(`<div class="page" page="${i}">${i+1}</div>`).insertBefore($(".next-page")).click(function() {
                window.page = i;
                updateProjectList(projects.slice(i*window.pageSize, i*window.pageSize + window.pageSize));
                $(".page").removeClass("active");
                $(this).addClass("active");
            });
        }
        $(".prev-page").off('click').on('click', function() {
            if(window.page == 0) return;
            if(window.page-1<pagerOffset) {
                updatePagination(projects, pagerOffset - pagerSize, pagerSize, true);
                return;
            }
            window.page --;
            updateProjectList(projects.slice(window.page*window.pageSize, window.page*window.pageSize + window.pageSize));
            $(".page").removeClass("active");
            $(`.page[page="${window.page}"]`).addClass("active");
        });
        $(".next-page").off('click').on('click', function() {
            if(window.page>=pageCount - 1) return;
            if(window.page+1>=pagerOffset + pagerSize) {
                updatePagination(projects, pagerOffset + pagerSize);
                return;
            }
            window.page ++;
            updateProjectList(projects.slice(window.page*window.pageSize, window.page*window.pageSize + window.pageSize));
            $(".page").removeClass("active");
            $(`.page[page="${window.page}"]`).addClass("active");
        });
        if(back)
            $(`.page:last`).click();
        else
            $(".page:first").click();
    }
    //Get projects and show in the active projects tab
    Utils.getJson("/api/project/all.php").then(function(data) {
        if(data.error) {
            Utils.toast(data.msg);
            return;
        }
        window.projects = data.records;
        updatePagination(window.projects);
        //Add new task dialog options
        $('[name="Project"]').append($(`<option value="">- SELECT PROJECT -</option>`));
        data.records.forEach(record => {
            let id = record["id"];
            let name = record["Project"];
            $('[name="Project"]').append($(`<option value="${id}">${name}</option>`));
        })
    });
    //Get Casting Companies
    Utils.getJson("/api/casting/all.php").then(function(data) {
        if(data.error) {
            Utils.toast(data.msg);
            return;
        }
        window.casting = data.records;
        $('[name="Casting Company"]').append($(`<option value="">- SELECT CASTING COMPANY -</option>`));
        data.records.forEach(record => {
            let id = record["id"];
            let name = record["Name"];
            $('[name="Casting Company"]').append($(`<option value="${id}">${name}</option>`));
        })
    });
    //Get Production Companies
    Utils.getJson("/api/production/all.php").then(function(data) {
        if(data.error) {
            Utils.toast(data.msg);
            return;
        }
        window.production = data.records;
        $('[name="Production Company"]').append($(`<option value="">- SELECT PRODUCTION COMPANY -</option>`));
        data.records.forEach(record => {
            let id = record["id"];
            let name = record["Production Company"];
            $('[name="Production Company"]').append($(`<option value="${id}">${name}</option>`));
        })
    });
    //Get Payroll Companies
    Utils.getJson("/api/payroll/all.php").then(function(data) {
        if(data.error) {
            Utils.toast(data.msg);
            return;
        }
        window.payroll = data.records;
        $('[name="Payroll Company"]').append($(`<option value="">- SELECT PAYROLL COMPANY -</option>`));
        data.records.forEach(record => {
            let id = record["id"];
            let name = record["Name"];
            $('[name="Payroll Company"]').append($(`<option value="${id}">${name}</option>`));
        })
    });
    //Get All Tasks
    Utils.getJson("/api/task/all.php").then(function(data) {
        if(data.error) {
            Utils.toast(data.msg);
            return;
        }
        window.tasks = data.records;
        //Add tasks list header
        $('.task-container .pending').append($("<b>PENDING</b>"));
        $('.task-container .done').append($("<b>MARKED AS DONE</b>"));
        //Add tasks items
        data.records.filter(record => record["Status"]!="true")
        .forEach(record => {
            let id = record["id"];
            let name = record["Task"];
            let projectID = record["Project"];
            let projectName = record["Project Name"];
            let date = moment(record["Shoot Date"]).format("MM/DD/YYYY");
            let dateOfWeek = moment(record["Shoot Date"]).format("dddd");
            $('.task-container .pending').append($(`<div class="card hflex" style="gap: 1em;">
                <input type="checkbox" task-id="${id}">
                <div class="vflex" style="flex-grow: 1;">
                    <div style="color: #141B26;">${name}</div>
                    <div style="color: #97AAC9;">Project: <a style="color: var(--theme-color-primary);" href="/search.php?projectID=${projectID}&viewType=projectDetail">${projectName}</a></div>
                </div>
                <div class="vflex" style="color: #2A4168;">
                    <div>${date}</div>
                    <div>${dateOfWeek}</div>
                </div>
            </div>`));
        });

        data.records.filter(record => record["Status"]=="true")
        .forEach(record => {
            let id = record["id"];
            let name = record["Task"];
            let projectID = record["Project"];
            let projectName = record["Project Name"];
            let date = moment(record["Shoot Date"]).format("MM/DD/YYYY");
            let dateOfWeek = moment(record["Shoot Date"]).format("dddd");
            $('.task-container .done').append($(`<div class="card hflex" style="gap: 1em;">
                <input type="checkbox" task-id="${id}" checked="true">
                <div class="vflex" style="flex-grow: 1;">
                    <div style="color: #141B26;">${name}</div>
                    <div style="color: #97AAC9;">Project: <a style="color: var(--theme-color-primary);" href="/search.php?projectID=${projectID}&viewType=projectDetail">${projectName}</a></div>
                </div>
                <div class="vflex" style="color: #2A4168;">
                    <div>${date}</div>
                    <div>${dateOfWeek}</div>
                </div>
            </div>`));
        });
    });

    //Search project box
    $(".search-project").on('keyup', function() {
        let keyword = $(this).val();
        if(keyword!='') {
            let filtered = window.projects.filter(project=>project["Project"].toLowerCase().includes(keyword.toLowerCase()));
            updatePagination(filtered);
            if(filtered.length == 0) updateProjectList([]);
        }
        else {
            updatePagination(window.projects);
        }
    });

    //Tomorrow label update
    $("[tomorrow]").text(moment().add(1, 'day').format("MMMM DD dddd"));

    //Tomorrow status cards
    Utils.postJson("/api/dashboard/tomorrow-status.php", {date: moment().add(1, 'day').format("YYYY-MM-DD")}).then(function(data) {
        if(data.error) {
            Utils.toast(data.msg);
            return;
        }
        let bookingConfirmed = 0;
        let finalDetailsSent = 0;
        let finalDetailsConfirmed = 0;
        let emergency = 0;
        data.records.forEach(record => {
            switch(record["Status"]) {
                case "Booking Confirmed":
                    bookingConfirmed = parseInt(record["Count"]);
                    break;
                case "Final Details Sent":
                    finalDetailsSent = parseInt(record["Count"]);
                    break;
                case "Final Details Confirmed":
                    finalDetailsConfirmed = parseInt(record["Count"]);
                    break;
                case "Emergency":
                    emergency = parseInt(record["Count"]);
                    break;
            }
        });
        let booked = bookingConfirmed + finalDetailsSent + finalDetailsConfirmed + emergency;
        $("[booked]").text(booked);
        $("[final-details-sent]").text(finalDetailsSent);
        $("[final-details-confirmed]").text(finalDetailsConfirmed);
        $("[emergency]").text(emergency);
    });
    //Tab click event
    $(".tab-item").on("click", function() {
        $(".tab-item").removeClass("active");
        $(this).addClass("active");
        let target = $(this).attr("for");
        $(".tab-content").removeClass("active");
        $(`#${target}`).addClass("active");
    });

    //Add new project button event
    $(".add-project-button").on("click", function() {
        $(".add-new-project-dialog").removeClass("displayNone");
        $(".add-new-project-dialog input").val("");
        $(".add-new-project-dialog select").val("");
    });
    $(".add-new-project-dialog .container").on("click", function(event) {
        event.stopPropagation();
    });
    $(".add-new-project-dialog").on("click", function() {
        $(".add-new-project-dialog").addClass("displayNone");
    })

    //Add new task button event
    $(".add-task-button").on("click", function() {
        $(".add-new-task-dialog").removeClass("displayNone");
        $(".add-new-task-dialog input").val("");
        $(".add-new-task-dialog select").val("");
    });
    $(".add-new-task-dialog .container").on("click", function(event) {
        event.stopPropagation();
    });
    $(".add-new-task-dialog").on("click", function() {
        $(".add-new-task-dialog").addClass("displayNone");
    })
});