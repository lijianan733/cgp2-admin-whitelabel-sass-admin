Ext.define('CGP.resource.controller.CompositeDisplayObject', {
    extend: 'Ext.app.Controller',
    stores: [
        'CompositeDisplayObject'
    ],
    models: ['CompositeDisplayObject'],
    views: [
        'compositeDisplayObject.Main',
        'compositeDisplayObject.Edit',
        'compositeDisplayObject.FillRule',
        'compositeDisplayObject.BaseInfor',
        'dynamicSizeImage.RuleGridField',
        'dynamicSizeImage.RuleForm',
        'dynamicSizeImage.RangeForm',
        'compositeDisplayObject.DisplayObject'
    ],
    init: function() {
        this.control({
            'viewport>panel button[itemId=btnSaveComposite]': {
                click: this.saveData
            },

        });
    },
    saveData:function(btn){
        var form=btn.ownerCt.ownerCt;
        if(!form.isValid()){
            return false;
        }
        var data=form.getValue();
        var url=adminPath + 'api/compositeDisplayObjects',method='POST';
        var id = JSGetQueryString('id');
        if(id){
            method='PUT';
            url+='/'+id;
        }
        var callback=function (require, success,response){
            var resp = Ext.JSON.decode(response.responseText);
            if(resp.success){
                form.data=resp.data;
            }
        };
        JSAjaxRequest(url, method, true, data,null, callback )
    },

});