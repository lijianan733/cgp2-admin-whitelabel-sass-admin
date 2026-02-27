Ext.define('CGP.resource.controller.Color', {
    extend: 'Ext.app.Controller',
    stores: [
        'Color'
    ],
    models: ['Color'],
    views: [
        'color.Main',
        // 'color.Edit'
    ],
    init: function() {
        this.control({
            // 'viewport grid button[itemId=createbtn] menu menuitem[itemId=addRGB]': {
            //     click: this.editRGB
            // }
        });
    },
    editRGB: function(btn) {

    },

    edit:function (btn,type,id){
        var colorMain=Ext.getCmp('colorMain');
        var url=path + "partials/resource/app/view/color/edit.html?colorType=" + type;
        if(id){
            url+='&id='+id;
        }
        JSOpen({
            id: colorMain.block + colorMain.editSuffix,
            url: url,
            title: colorMain.pageText.create + '_' + colorMain.i18nblock,
            refresh: true
        });
    },

    getColor: function (data) {
        var me=this;
        var colorClazz = data.clazz,colorComp='';
        if (colorClazz.indexOf('RGBColor')>0) {
            colorComp='#' + JSGetHEx(data['r']) + JSGetHEx(data['g']) + JSGetHEx(data['b']);
        } else if (colorClazz.indexOf('CMYKColor')>0) {

        } else  {
            var color = data.gray;
            colorComp = ('<a  href="#"></a>' + color);
        }
        return colorComp;
    }
});