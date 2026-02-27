Ext.onReady(function(){

    var mailTemplateTabs = window.parent.Ext.getCmp('mailTemplateTabs');
    var websiteId = mailTemplateTabs.websiteId;
    var partnerId = mailTemplateTabs.partnerId;
    //邮件模版文件名的store
    var TemplateNamesStore = Ext.create("CGP.partner.store.MailTemplateFileStore",{
        params: {
            target : 'manager',
            partnerId: partnerId
        }
    });
    TemplateNamesStore.load({
        callback : function(i ,e,u){
        }
    });

    var controller = Ext.create('CGP.partner.controller.Controller');

    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('mailtemplate'),
        block: 'mailtemplate',
        // 编辑页面
        editPage: 'managerfileedit.html',
        tbarCfg : {
            disabledButtons: ['delete'],
            btnCreate : {
//				disabled : true,
                handler : function() {
                    mailTemplateTabs.addServerFileEditTab(null,i18n.getKey('managerMailTemplateFile'));
                }
            }
        },
        height : '100%',
        gridCfg: {
            // store是指store.js
            store: TemplateNamesStore,
            frame: false,
            editActionHandler : showTabEdit,
            bodyStyle: 'overflow-x:hidden;',
            columns: [{
                sortable: false,
                text: i18n.getKey('operation'),
                width: 100,
                autoSizeColumn: false,
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record) {
                    var id = record.get('id');
                    var target = 'manager';
                    return {
                        xtype: 'toolbar',
                        layout: 'column',
                        style: 'padding:0',
                        default: {
                            width: 100
                        },
                        items: [
                            {
                                text: i18n.getKey('options'),
                                width: '100%',
                                flex: 1,
                                menu: {
                                    xtype: 'menu',
                                    items: [
                                        {
                                            text: i18n.getKey('mailFileTempalteContent'),
                                            disabledCls: 'menu-item-display-none',
                                            handler: function () {
                                                controller.showMailtemplateFileContent(id,target,websiteId,partnerId);
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            },{
                text: i18n.getKey('id'),
                dataIndex: 'id',
                itemId: 'id',
                sortable: true,
                width: 80
            },{
                text: i18n.getKey('mailTemplate') + i18n.getKey('fileName'),
                dataIndex: 'name',
                itemId: 'fileName',
                sortable: false,
                width: 150
            },{
                text: i18n.getKey('description'),
                dataIndex: 'description',
                itemId: 'description',
                sortable: false,
                width: 220
            }]
        },
        filterCfg: {
            hidden: true,
            items: [{
                id: 'idSearchField',
                name: 'id',
                xtype: 'numberfield',
                hideTrigger: true,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            },{
                id: 'fileNameSearch',
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('mailTemplate') + i18n.getKey('fileName'),
                itemId: 'fieldName'
            },{
                id:'description',
                name: 'description',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description'
            }]
        }
    });
    function showTabEdit(gridview, recordIndex, cellIndex, fun,button,record){
        var id = record.getId();
        mailTemplateTabs.addServerFileEditTab(id,i18n.getKey('managerMailTemplateFile'));
    }
})
