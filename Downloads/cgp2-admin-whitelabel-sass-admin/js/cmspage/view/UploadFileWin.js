Ext.define('CGP.cmspage.view.UploadFileWin',{
    extend: 'Ext.window.Window',

    width: 600,
    height: 300,
    layout: 'fit',
    modal: true,
    initComponent: function(){
        var me = this;
        me.title = i18n.getKey('uploadStaticResource');
        me.items = [{
            xtype: 'form',
            border: false,
            padding: '10px',
            items: [{
                xtype: 'combo',
                name: 'website',
                itemId: 'websiteId',
                width: 350,
                allowBlank : false,
                fieldLabel: i18n.getKey('website'),
                store: Ext.create('CGP.cmspage.store.Website'),
                valueField: 'id',
                labelAlign : 'right',
                msgTarget: 'side',
                displayField: 'name',
                editable: false
            },{
                xtype : 'uxfilefield',
                labelAlign : 'right',
                name : 'files',
                msgTarget: 'side',
                uploadFolder: true,
                allowBlank : false,
                buttonText : i18n.getKey('browser'),
                fieldLabel : i18n.getKey('chooseFolder'),
                buttonConfig : {
                    width : 70
                },
                width : 550,
                height : 130,
                itemId : 'file'
            }]
        }];
        me.bbar = ['->',
            {
                xtype: 'button',
                text: i18n.getKey('upload'),
                handler: function(){
                    if(me.form.isValid()){
                        var controller = Ext.create('CGP.cmspage.controller.Controller');
                        var fileField = me.form.getComponent('file');
                        var websiteId = me. form.getComponent('websiteId').getValue();
                        var files = fileField.fileInputEl.dom.files;
                        var fileArray = [];
                        for(var i = 0;i<files.length; i++){
                            (function (files, i,fileArray) {
                                var reader = new FileReader();
                                var path = files[i].webkitRelativePath;
                                reader.addEventListener('load', function (evt) {
                                    if (fileField.activeErrors == null) {
                                        var fileContent = evt.target.result;
                                    }
                                    var fileInfo = {'path': path, 'content': fileContent};
                                    fileArray.push(fileInfo);
                                    if(i == files.length-1){
                                        controller.uploadStaticResource(websiteId,fileArray,me)
                                    }
                                });
                                reader.readAsText(files[i], 'UTF-8');
                            })(files, i,fileArray);
                        }
                    }
                }
        },{
                xtype: 'button',
                text: i18n.getKey('cancel'),
                handler: function(){
                    me.close();
                }
            }];
        me.callParent(arguments);
        me.form = me.down('form');
    }
})