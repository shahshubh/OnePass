var windowUtil = require("./js/windowUtil");
var th = require("./js/templateHelper");


function scrollToBottom(elementName){
  var element = document.querySelector(elementName);
  element.scrollTop = element.scrollHeight - element.clientHeight;
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
            console.log($(".newpwditem *"));
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
                }
            });
        });
    });

    // $('#filterKey').focus();



    // Search Items

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


});