Ext.define('CGP.configuration.controller.Controller',{

    /**
     * 显示邮件模板文件内容
     * @param {Number} fileId 模板文件ID
     * @param {String} target 邮件模板类型
     * @param {Number} websiteId 网站ID
     */
    showMailtemplateFileContent: function(fileId,target,websiteId){
        var me = this;

        Ext.Ajax.request({
            url: adminPath+'api/configurations/mailtemplatefilenames/'+fileId+'/content?target='+target+'&websiteId='+websiteId,
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function(resp){
                var fileContent = Ext.JSON.decode(resp.responseText).data.content;

                    Ext.create('Ext.window.Window',{
                        layout: 'fit',
                        constrain: true,
                        modal: true,
                        id: 'fileContentWin',
                        title: i18n.getKey('mailFileTempalteContent'),
                        items: [{
                            xtype: 'textarea',
                            id: 'fileContent',
                            width: 800,
                            height: 500,
                            autoScroll: true,
                            value: fileContent
                        }],
                        bbar: ['->',{
                            xtype: 'button',
                            text: i18n.getKey('preview'),
                            handler: function(){
                                me.previeEmailTemplateFile(Ext.getCmp('fileContent').getValue());
                            }
                        },{
                            xtype: 'button',
                            text: i18n.getKey('confirmModify'),
                            handler: function(){
                                var modifyContent = Ext.getCmp('fileContent').getValue();
                                var contentWin = Ext.getCmp('fileContentWin');
                                me.modifyFileTemplateContent(fileContent,fileId,target,websiteId,modifyContent,contentWin);
                            }
                        }]
                    }).show();

            },
            failure: function(resp){
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'),response.data.message);
            }

        });
    },
    /**
     * 修改文件内容的方法
     * @param {String} fileContent 文件内容
     * @param {Number} fileId 文件ID
     * @param {String} target 邮件模板类型
     * @param {Number} websiteId 网站ID
     * @param {String} modifyContent 修改的文件内容
     */
    modifyFileTemplateContent: function(fileContent,fileId,target,websiteId,modifyContent,contentWin){
        var me = this;
        Ext.Ajax.request({
            url: adminPath+'api/configurations/mailtemplatefilenames/'+fileId+'/content?target='+target+'&websiteId='+websiteId,
            method: 'PUT',
            headers: {'Authorization': 'Bearer ' + Ext.util.Cookies.get('token'),'Content-Type': 'text/plain'},
            params: modifyContent,
            success: function(resp){
                var response = Ext.JSON.decode(resp.responseText);
                var isSuccess = response.success;
                if(isSuccess == true){
                    Ext.Msg.alert('提示','修改成功！',function close() {contentWin.close();});
                }else{
                    Ext.Msg.alert(i18n.getKey('requestFailed'),response.data.message);
                }
            },
            failure: function(resp){
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'),response.data.message);
            }
        })
    },
    /**
     * 预览邮件模板文件内容
     * @param {string} content
     */
    previeEmailTemplateFile: function(content){
        var me = this;

        Ext.create('Ext.window.Window',{
            width: 800,
            height: 500,
            modal: true,
            title: i18n.getKey('preview'),
            autoScroll: true,
            html: content
        }).show();
    }

})