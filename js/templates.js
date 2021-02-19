module.exports = {
    pwdItemTemplate : `
    <tr id="%ITEMID%" class="row pwditem" >
        <td class="text-left key-td">
            <input id="%HDNKEYID%" type="hidden" value="%HDNKEY%" />
            <input id="%KEYID%" type="text" class="form-control form-control-sm text-input key" placeholder="key" value="%KEY%" />
        </td>
        <td class="text-left value-td">
            <input id="%VALUEID%" type="password" class="form-control form-control-sm text-input value" value="%VALUE%" />
        </td>
        <td class="btn-td" >
            <button id="%GENBTNID%" type="button" class="btn btn-sm btn-info generate round" title="generate secure random password"><i class="fas fa-random fa-md"></i></button>
        </td>
        <td class="btn-td" >
            <button id="%SAVEBTNID%" type="button" class="btn btn-sm btn-success save round" title="save item">
                <i class="far fa-save fa-lg"></i>
            </button>
        </td>
        <td class="btn-td" >
            <button id="%DELBTNID%" type="button" class="btn btn-sm btn-outline-danger btn-floating delete round" title="remove item"><i class="fas fa-trash fa-md"></i></button>
        </td>
        
    </tr>

    `
};


{/* <div id="%ITEMID%" class="row pwditem">
    <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
        <input id="%HDNKEYID%" type="hidden" value="%HDNKEY%" />
        <input id="%KEYID%" type="text" class="form-control form-control-sm text-input key" placeholder="key" value="%KEY%" />
    </div>
    <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
        <input id="%VALUEID%" type="password" class="form-control form-control-sm text-input value" value="%VALUE%" />
    </div>
    <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
        <button id="%GENBTNID%" type="button" class="btn btn-sm btn-info generate" title="generate secure random password"><i class="fas fa-random fa-lg"></i></button>
        <button id="%SAVEBTNID%" type="button" class="btn btn-sm btn-success save" title="save item"><i class="far fa-save fa-lg"></i></button>
        <button id="%DELBTNID%" type="button" class="btn btn-sm btn-danger delete" title="remove item"><i class="fas fa-minus-circle fa-lg"></i></button>
    </div>
</div> */}
