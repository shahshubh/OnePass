const windowUtil = require("./js/windowUtil");
const handleData = require("./utils/handleData");
const th = require("./js/templateHelper");
const fs = require("fs");
const passwordValidator = require('password-validator');
let schema = new passwordValidator();
const ipc = require('electron').ipcRenderer;

const dataStorePath = __dirname+"/data/data.json";

// password validator schema
schema
    .is().min(6)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase(1)                            // Must have uppercase letters
    .has().lowercase(1)                              // Must have lowercase letters
    .has().digits(1)
    .has().symbols(1)                                // Must have at least 2 digits/
    .has().not().spaces();


function scrollToBottom(elementName){
  var element = document.querySelector(elementName);
  element.scrollTop = element.scrollHeight - element.clientHeight;
}

function removeFlashMessage(className, duration=2500){
  setTimeout(function(){
      $(className).fadeOut('fast');
  }, duration);
}

function changePassword(newPassword){
  handleData.loadJsonData(function (jsonData) {
    let data = jsonData;
    data.masterKey = cryp.encrypt(newPassword);

    fs.writeFile(dataStorePath, JSON.stringify(jsonData, null, 2), function (err) {
        if (err) {
            console.log(err);
        }
        $("#message").parent()[0].style.display = "flex";
        $("#message").text("Password changed successfully !!");
        removeFlashMessage(".alert.alert-success");
        setTimeout(() => {
          ipc.send('load-page', 'file://' + __dirname + '/welcome.html');
        }, 700);
    });
});
  
}

$(() => {

    $("#message-cross").on("click", function(){
        $("#message").parent()[0].style.display = "none";
    });

    $('#filterKey').bind('input propertychange', function () {
        const text = this.value;
        if (text && text.length > 0) {
            $(".key").each(function (index) {
                if (!$(this).val().includes(text))
                    $(this).parent().parent(".pwditem").hide();
                else
                    $(this).parent().parent(".pwditem").show();
            });
            // console.log($(".newpwditem *"));
            $(".newpwditem *").prop('disabled', true);
        }
        else {
            $(".pwditem:hidden").show();
            $(".newpwditem *").prop('disabled', false);
        }
    });

    $("#resetFilter").bind("click", function () {
        $("#filterKey").val("");
        $(".pwditem").show();
        $(".newpwditem *").prop('disabled', false);
    });

    // load password items from the data file to UI
    windowUtil.loadItems(function (elements) {
      var passwordItems = $("#passwordItems");
      
        
        let index = 0;
        elements.forEach(element => {
            let content = th.templateContent(element, index);
            // console.log(passwordItems);
            passwordItems.append(content);
            index++;
        });

        th.templateBinder();

        // new item
        $(".addNew").bind("click", function () {
            windowUtil.addItem(this, function (element) {
                // refresh items list after add
                if (element != null) {
                    var passwordItems = $("#passwordItems");
                    let lastItemID = $("#passwordItems .pwditem").last().attr("id");
                    let index = (lastItemID != null) ? parseInt(lastItemID.replace("item_", "")) + 1 : 0;
                    let content = th.templateContent(element, index);
                    passwordItems.append(content);

                    th.templateBinder();
                    //scroll to bottom after adding item
                    scrollToBottom(".table-mid-container");
                    $("#message").parent()[0].style.display = "flex";
                    $("#message").text("Added Successfully !!");
                    setTimeout(function(){
                      $(".alert.alert-success").fadeOut('fast');
                  }, 2000);
                }
            });
        });
    });

    // $('#filterKey').focus();



    // ------------------------- Search Items -------------------------

    const ELEMENTS = {
      MAIN_SEARCH_ELEMENT: "#main_search_element",
      ACTION_EXPAND_ELEMENT: ".action-expand",
      ACTION_COLLAPSE_ELEMENT: ".action-collapse"
    };
    
    let isExpanded = false;
    
    const ToggleSearchElement = document.querySelector(
      ELEMENTS.ACTION_EXPAND_ELEMENT
    );
    
    const SearchIconCircleElement = document.querySelector(
      ELEMENTS.MAIN_SEARCH_ELEMENT
    );
    
    ToggleSearchElement.onclick = () => {
      searchIconExpandToggle();
    };
    
    const searchIconExpandToggle = () => {
      isExpanded = !isExpanded;
    
      if (isExpanded) {
        SearchIconCircleElement.classList.add("expand");
    
        watchForCollapseAction();
      } else {
        SearchIconCircleElement.classList.remove("expand");
      }
    };
    
    const watchForCollapseAction = () => {
      const ToggleSearchElement = document.querySelector(
        ELEMENTS.ACTION_COLLAPSE_ELEMENT
      );
    
      ToggleSearchElement.onclick = () => {
        searchIconExpandToggle();
      };
    };



    // ------------------------- Top Header Icons -------------------------
    const ipc = require("electron").ipcRenderer;
			$(".logout-item").on("click", () => {
				// console.log("Logout");
				ipc.send("load-page", "file://" + __dirname + "/welcome.html");
			});

			

			$(".item").hover(
				function () {
					var $this = $(this);
					expand($this);
				},
				function () {
					var $this = $(this);
					collapse($this);
				}
			);
			function expand($elem) {
        let isEleChangePass = $elem[0].className.split(/\s+/).includes("change-pass-item");
        let isEleLogout = $elem[0].className.split(/\s+/).includes("logout-item");
        let expandWidth = isEleChangePass ? "180px" : isEleLogout ? "110px" : "145px";


        var angle = 0;
				var t = setInterval(function () {
					if (angle == 1440) {
						clearInterval(t);
						return;
					}
					// angle += 40;
					// $('.link',$elem).stop().animate({rotate: '+=-40deg'}, 0);
				}, 10);
				$elem
					.stop()
					.animate({ width: expandWidth }, 300)
					.find(".item_content")
					.fadeIn(100, function () {
						$(this).find("p").stop(true, true).fadeIn(200);
					});
			}
			function collapse($elem) {
				// console.log("collapse");
				var angle = 1440;
				var t = setInterval(function () {
					if (angle == 0) {
						clearInterval(t);
						return;
					}
					// angle -= 40;
					// $('.link',$elem).stop().animate({rotate: '+=40deg'}, 0);
				}, 10);
				$elem
					.stop()
					.animate({ width: "40px" }, 300)
					.find(".item_content")
					.stop(true, true)
					.fadeOut()
					.find("p")
					.stop(true, true)
					.fadeOut();
			}


// ------------------------- Change Password -------------------------
$('#change-pass-submit-btn').on('click', function(){
  let currentPassword = $('#current-pass').val();
  let newPassword = $('#new-pass').val();

  fs.readFile(dataStorePath, "utf8", function (err, data) {
    if (err) return null;
    jsonData = JSON.parse(data);
    let masterKey = cryp.decrypt(jsonData.masterKey);

    if(currentPassword === masterKey){
      if(schema.validate(newPassword)){
        changePassword(newPassword);
      }
      else{
        $("#error-message").parent()[0].style.display = "flex";
        $("#error-message").text("Password must be 6-100 characters long and contain at least 1 upper case letter, 1 number, 1 special character");
        removeFlashMessage(".alert.alert-danger", 3500);
      }
    }
    else {
      // current password is incorrect
      $("#error-message").parent()[0].style.display = "flex";
      $("#error-message").text("Current password you entered is incorrect");
      removeFlashMessage(".alert.alert-danger");
    }
  });

  // Clear form
  $('#new-pass').val("");
  $('#current-pass').val("");
  $('#changePasswordModal').modal('hide');
});


});