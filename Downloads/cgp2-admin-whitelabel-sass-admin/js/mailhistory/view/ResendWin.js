Ext.Loader.syncRequire(['CGP.mailhistory.controller.overridesubmit']);
Ext.define('CGP.mailhistory.view.ResendWin',{
    extend: 'Ext.window.Window',

    modal: true,
    width: 800,
    autoScroll: true,

    bodyStyle: 'padding:10px',
    totalValue : 100,

    initComponent: function(){
        var me = this;

        var controller = Ext.create('CGP.mailhistory.controller.Controller');
        me.title = i18n.getKey('resend')+i18n.getKey('mail');
        me.height = 600;
        me.bbar = ['->',{
            xtype: 'button',
            text: i18n.getKey('send'),
            iconCls: 'icon_send',
            handler: function(){
                if(me.form.isValid()) {
                    var data = {};
                    data.mailSender = me.record.get('mailSender');
                    data.websiteId = me.record.get('websiteId');
                    data.from = me.record.get('from');
                    me.form.items.each(function(item){
                        if(item.name == 'receivers'){
                            var fieldValues = me.form.getComponent('receivers').getValue();
                            var fieldArray = fieldValues.split(',');
                            var Valida = Ext.form.field.VTypes;
                            var emailArray = [];
                            var errorEmailList = '';
                            Ext.Array.each(fieldArray,function(value){
                                if(Valida.email(value)){
                                    emailArray.push(value);
                                }else{
                                    errorEmailList =errorEmailList+','+value;
                                }
                            })
                            var errorEmail = errorEmailList.substring(1);
                            data[item.name] = emailArray;
                            if(!Ext.isEmpty(errorEmail)){
                                Ext.MessageBox.confirm('提示','邮件地址'+errorEmail+'无效,是否去除无效地址继续发送！',function(click){
                                    if(click == 'yes'){
                                        me.form.getComponent('receiver').setValue(fieldValues.replace(errorEmailList,''));
                                    }else{
                                        return;
                                    }
                                })
                            }
                        }else if(item.name == 'attachments'){
                            function getSubmitValue() {
                                var value = [];
                                var fieldArray = me.form.getComponent('attachmentsList').items.items;
                                for(var i= 0; i < fieldArray.length; i++ ){
                                    var field = fieldArray[i];
                                    var uploadId = field.uploadId;
                                    var name = field.name;
                                    /*var email = html.split("|")[1];
                                    email = email.split("|")[0];*/
                                    value.push({
                                        name: name,
                                        url: imageServer+name
                                    });
                                }
                                return value;
                            }
                            data[item.name] = getSubmitValue();
                        }else {
                            if(item.xtype != 'form'){
                                data[item.name] =  item.getValue();
                            }
                        }
                    });
                    if(Ext.isEmpty(data['text'])){
                        Ext.Msg.alert('提示','发送内容不能为空!')
                    }else{
                        var receivers = data.to.split(',');
                        data.to = receivers;
                        controller.resendMailHistory(data,me.recordId,me);
                    }
                }
            }
        },{
            xtype: 'button',
            iconCls: 'icon_cancel',
            text: i18n.getKey('cancel'),
            handler: function(){
                me.close();
            }
        }];
        var form = {
            xtype: 'form',
            border: false,
            width: 750,
            items:[{

                xtype: 'textfield',
                itemId: 'subject',
                name: 'subject',
                width: 500,
                value: me.record.get('subject'),
                fieldLabel: i18n.getKey('subject'),
                allowBlank: false,
                msgTarget: 'side'

            },{xtype: 'textfield',
                itemId: 'receivers',
                name: 'to',
                width: 500,
                value: me.record.get('to'),
                fieldLabel: i18n.getKey('receiver'),
                allowBlank: false,
                msgTarget: 'side'
            },
            {
                xtype: 'htmleditor',
                itemId: 'content',
                name: 'text',
                value: me.record.get('text'),
                width: 750,
                height:300,
                fieldLabel: i18n.getKey('content')
            },{
                    xtype: 'form',
                    itemId: 'fileUpload',
                    border: false,
                    width: 450,
                    height:'100%',
                    layout : {
                        type : 'table',
                        columns: 2
                    },
                    items:[{
                        name: 'files',
                        xtype: 'filefield',
                        width: 350,
                        enableKeyEvents: true,
                        buttonText: i18n.getKey('choice'),
                        fieldLabel: i18n.getKey('attachments'),
                        itemId: 'file'
                    },{
                        xtype : 'button',
                        text : i18n.getKey('upload'),
                        id: 'attachmentsBar',
                        itemId: 'attachmentsBar',
                        style : {
                            marginTop: '-4px',
                            marginLeft : '5px'
                        },
                        minWidth : 60,
                        handler : function(button){

                            var formPanel = me.form.getComponent('fileUpload');
                            var attachmentsList = me.form.getComponent('attachmentsList');
                            var file = formPanel.getComponent('file');
                            if (!Ext.isEmpty(file.getRawValue())) {
                                var myMask = new Ext.LoadMask(me,{msg:"上传中..."});
                                myMask.show();
                                formPanel.getForm().submit({
                                    url: adminPath + 'api/files?access_token=' + Ext.util.Cookies.get('token'),
                                    method: 'POST',
                                    success: function (form, action) {
                                        myMask.hide();
                                        var fileName = action.response.data[0].originalFileName;
                                        var uploadId = action.response.data[0].id;
                                        var name = action.response.data[0].name;
                                        controller.setSingleValue(fileName,uploadId,attachmentsList,name);
                                        file.reset();
                                    },
                                    failure: function (form, action) {
                                        myMask.hide();
                                    }
                                });
                            }
                        }
                    }]
                },{
                    xtype: 'form',
                    itemId: 'attachmentsList',
                    width: 750,
                    name: 'attachments',
                    height:'100%',
                    border: false,
                    style : {
                        marginLeft : '105px'
                    },
                    layout : {
                        type : 'table',
                        columns: 2
                    },
                    listeners: {
                        afterrender: function(){
                            controller.setAttachmentsValue(me.record.get('attachments'),this);
                        }
                    }
                }]
        };
        me.items = [form];
        me.callParent(arguments);
        me.form = me.down('form');
    }
})
Ext.namespace("editController");
editController.deleteEmail = function(itemId){
    var field = Ext.getCmp(itemId);
    field.ownerCt.remove(field);
}