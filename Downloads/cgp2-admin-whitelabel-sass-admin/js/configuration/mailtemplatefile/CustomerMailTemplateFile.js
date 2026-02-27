Ext.onReady(function(){



    // JS的去url的参数的方法，用来页面间传参
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    var websiteId = getQueryString("websiteId");

    //邮件模版文件名的store
    var TemplateNamesStore = Ext.create("CGP.configuration.store.MailTemplateFileStore",{
        params: {
            target : 'customer',
            websiteId : websiteId
        }
    });
    TemplateNamesStore.load({
        callback : function(i ,e,u){
        }
    });

    var controller = Ext.create('CGP.configuration.controller.Controller');

    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('mailtemplate'),
        block: 'mailtemplate',
        // 编辑页面
        editPage: 'edit.html',
        tbarCfg: {
            disabledButtons: ['delete'],
            btnCreate : {
//				disabled : true,
                handler : function() {
                    window.parent.addCustFileEditTab(null,i18n.getKey('customerMailTemplateFile'));
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
                    var target = 'customer';
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
                                                controller.showMailtemplateFileContent(id,target,websiteId);
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
                width: 50
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
            minHeight :120,
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
        window.parent.addCustFileEditTab(id,i18n.getKey('customerMailTemplateFile'));
    }
})
