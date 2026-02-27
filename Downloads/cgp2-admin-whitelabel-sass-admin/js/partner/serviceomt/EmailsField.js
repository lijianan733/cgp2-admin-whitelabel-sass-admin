//旧的邮件选择组件
Ext.define('CGP.partner.serviceomt.EmailsField', {
    extend: 'Ext.form.field.Display',
    alias: 'widget.emailsfield',

    require: [
        'Ext.panel.Panel'
    ],

    _panel: null,

    fieldText: {
        saveSuccess: 'Save Successfully',
        prompt : 'prompt',
        cancel : 'Cancel',
        save  : 'Save',
        add : 'Add',
        emailFormatError : 'Email Format Error',
        Email : "Email",
        setAddressee : 'Set Addressee'
    },

    selType: 'rowmodel',

    _contentId: null,

    totalValue : 100,
    emailWidth : 245,

    initComponent: function () {
        var me = this;
        initResource(me.fieldText);

        me.callParent(arguments);

        me.emailWidth = me.emailWidth ||245;
        if(!me.panelConfig){
            throw new Error('panelConfig can not be null!');
        }
        me.panelConfig = Ext.merge({
            width : me.width - me.labelWidth -5,
            minHeight : 200,
//				title : me.fieldText.setAddressee,
            id: 'editAddresseeWin',
            tbar : [{
                xtype : 'textfield',
                width : 200,
                itemId : 'enterEmail',
                labelWidth : 40,
                labelAlign : 'lift',
                msgTarget : 'side',
                fieldLabel : me.fieldText.Email,
                regex: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
                regexText: i18n.getKey('Please enter the correct email!'),
                listeners: {
                    specialkey: function(field, e){
                        if (e.getKey() == e.ENTER) {
                            var button = field.ownerCt.child("button");
                            button.handler();
                        }
                    }
                }
            },{
                xtype : 'button',
                text : me.fieldText.add,
                style : {
                    marginLeft : '0px'
                },
                minWidth : 60,
                handler : function(button){
                    var textfield = this.ownerCt.getComponent("enterEmail");
                    if(textfield.isValid( )){
                        if(!Ext.isEmpty(textfield.getValue()))
                            me.setSingleValue(textfield.getValue());
                    }
                    textfield.reset( );
                }
            }],
            layout : {
                type : 'table',
                columns: 2
            },
            items : []
        },me.panelConfig);

        me._contentId = me.panelConfig.renderTo || "panelfield-content-id";
        var width = me.panelConfig.width = me.panelConfig.width || 200;
        var height = me.panelConfig.height = me.panelConfig.height || 200;
        var value = '<div id="' + me._contentId + '" ></div>';
        me.setValue(value);
        me.on("disable",function(display){
            display.getPanel().setDisabled(true);
        });
    },
    onRender: function () {
        this.callParent(arguments);

        this.initPanel();
    },
    initPanel : function(){
        var me = this;
        me.panelConfig = Ext.merge(me.panelConfig, {
            renderTo: document.getElementById(me._contentId)
        });
        me._panel = new Ext.panel.Panel(me.panelConfig);
    },

    reset: function () {
        this._panel.removeAll();
    },

    getPanel : function(){
        return  this._panel;
    },

    getSubmitValue: function () {
        var me = this;
        var value = '';
        var fieldArray = me._panel.items.items;
        for(var i= 0; i < fieldArray.length; i++ ){
            var field = fieldArray[i];
            var html = field.getValue();
            var email = html.split(">")[1];
            email = email.split("<")[0].replace(/\s+/g,'');
            value = value + email;
            if(i != fieldArray.length -1){
                value = value + ",";
            }
        }
        return value;
    },

    setSubmitValue: function (value) {
        var me = this;
        if(Ext.isEmpty(value)){
            return ;
        }
        var arrayEmails = value.split(",");
        me.reset();
        for(var i= 0 ;i < arrayEmails.length; i++){
            me.setSingleValue(arrayEmails[i]);
//			me.totalValue = me.totalValue + 1;
//			var imgurl = '../../ClientLibs/extjs/resources/themes/images/shared/fam/cross.png';
//			var totalValue = me.totalValue;
//			var id = "addresseeEmail_"+totalValue;
//			var width = (me._panel.width -10)/2;
//			var objDisplay = {
//					id : id,
//					width : width,
//					style: 'text-align: right',
//					hideLabel : true,
//					value : "<div id = '"+id+"' class='emailDiv'>"+arrayEmails[i]+" <img src='"+imgurl+"' onclick='editController.deleteEmail(\""+id+"\")'/></div>"
//				};
//			var displayField = new Ext.form.field.Display(objDisplay);
//			var panel = me._panel;
//			panel.add(displayField);
        }
    },

    setSingleValue : function(value){
        var me = this;
        me.totalValue = me.totalValue + 1;
        var imgurl = '../../ClientLibs/extjs/resources/themes/images/shared/fam/cross.png';
        var totalValue = me.totalValue;
        var id = "addresseeEmail_"+totalValue;
        var width = (me._panel.width -10)/2;
        var objDisplay = {
            id : id,
            width : width,
            style: 'text-align: right',
            hideLabel : true,
            value : "<div id = '"+id+"' class='emailDiv'>"+value+" <img src='"+imgurl+"' onclick='deleteEmail(\""+id+"\")'/></div>"
        };
        var displayField = new Ext.form.field.Display(objDisplay);
        var panel = me._panel;
        panel.add(displayField);
    }

});
window.deleteEmail = function(itemId){
    var field = Ext.getCmp(itemId);
    field.ownerCt.remove(field);
}