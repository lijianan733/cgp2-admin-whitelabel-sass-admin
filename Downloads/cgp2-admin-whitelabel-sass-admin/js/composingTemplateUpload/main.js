Ext.Loader.syncRequire(['CGP.composingTemplateUpload.overridesubmit','Ext.ux.form.field.TriggerField','Ext.ux.form.field.FileField']);
Ext.onReady(function () {


    var uploadForm = new Ext.ux.form.Panel({
        renderTo: Ext.getBody(),
        id: 'uploadform',
        bodyStyle: {
            padding: "5px"
        },
        name: '上传文件',
        formBind: true,
        width: '100%',
        autoScroll: false,
        itemId: 'fileUpload',
        border: false,
        items:[{
            xtype : 'uxfilefield',
            labelAlign : 'right',
            name : 'files',
            allowBlank : false,
            buttonText : '选择',
            fieldLabel : '上传排版文件',
            buttonConfig : {
                width : 70
            },
            width : 580,
            height : 130,
            itemId : 'file'
        },{
            xtype : 'button',
            text : '上传',
            id: 'attachmentsBar',
            itemId: 'attachmentsBar',
            width: 70,
            style : {
                marginTop: '-5px',
                marginLeft : '5px'
            },
            minWidth : 60,
            handler : function(button){

                var fileForm = this.ownerCt;
                //将items转为htmlform
                if(uploadForm.isValid()){
                    var lm = fileForm.setLoading(true);
                    fileForm.submit({
                        url: adminPath + 'api/admin/composingTemplate/upload?access_token=' + Ext.util.Cookies.get('token'),
                        success: function (form, action) {
                            lm.hide();
                            var response = action.response;
                            if (response.success) {
                                Ext.Msg.alert('提示','上传成功',function callback(){
                                   // fileForm.getComponent('file').getEl().fireEvent('change');
                                });
                            } else {
                                Ext.Msg.alert('提示', response.message);
                            }
                        },
                        failure: function(){
                            lm.hide();
                            Ext.Msg.alert('提示','请求服务器失败!');
                        }
                    });
                }
            }
        }]
    });

});