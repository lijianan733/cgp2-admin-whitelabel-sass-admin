/**
 * Created by nan on 2018/1/31.
 * 用于配置对应网站的合作伙伴的申请结果通知邮件，需要配置通过，和拒绝两种邮件模板
 */
Ext.syncRequire([
    'CGP.mailhistory.view.DiyArrayColumn',
    'CGP.role.store.Role',
    'CGP.common.field.WebsiteCombo'
]);
Ext.onReady(function () {
    var websiteStore = Ext.create("CGP.partnerapplys.store.WebsiteAll");
    var partnerApplyResultEmailConfigStore = Ext.create('CGP.partnerapplyresultemailconfig.store.PartnerApplyResultEmailConfigStore', {}
    );
    var controller = Ext.create('CGP.partnerapplyresultemailconfig.controller.Controller');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('mailtemplate'),
        block: 'partner',
        // 编辑页面
        editPage: 'serviceomtedit.html',
        height: '100%',
        tbarCfg: {
            btnCreate: {
//				disabled : true,
                handler: function (view) {
                    JSOpen({
                        id: 'partnerApplyResultEmailConfigEdit',
                        url: path + 'partials/partnerapplyresultemailconfig/edit.html',
                        title: i18n.getKey('create') + '_partner' + i18n.getKey('applyResultEmailConfig'),
                        refresh: true
                    });
                }
            },
            btnDelete: {
                hidden: true
            }

        },
        gridCfg: {
            store: partnerApplyResultEmailConfigStore,
            frame: false,
            deleteAction: false,
            editAction: false,
            selType: 'rowmodel',
            columnDefaults: {
                autoSizeColumn: true
            },
            columns: [
                {
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    width: 60,
                    tdCls: 'vertical-middle',
                    items: [
                        {
                            iconCls: 'icon_edit icon_margin',
                            itemId: 'actionedit',
                            tooltip: i18n.getKey('edit'),
                            handler: function (gridview, recordIndex, cellIndex, fun, button, record) {
                                var id = record.getId();
                                JSOpen({
                                    id: 'partnerApplyResultEmailConfigEdit',
                                    url: path + 'partials/partnerapplyresultemailconfig/edit.html?recordId=' + id,
                                    title: i18n.getKey('edit') + '_partner' + i18n.getKey('applyResultEmailConfig'),
                                    refresh: true
                                });
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    itemId: 'id'
                },
                {
                    text: i18n.getKey('website'),
                    dataIndex: 'websiteId',
                    xtype: 'gridcolumn',
                    width: 200,
                    editable: false,
                    itemId: 'website',
                    renderer: function (value, metra, record) {
                        var record = websiteStore.findRecord('id', value);
                        if (Ext.isEmpty(record)) {
                            return;
                        }
                        var name = record.get('name');
                        return name;
                    }
                },
                {
                    text: i18n.getKey('agreed') + i18n.getKey('notifyEmailConfig'),
                    dataIndex: 'verifySuccessNotificationConfig',
                    xtype: 'componentcolumn',
                    width: 200,
                    itemId: 'verifySuccessNotificationConfig',
                    renderer: function (value, metra, record) {
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#" id="click-verifySuccessNotificationConfig" style="color: blue;text-decoration: none">' + i18n.getKey('check') + '</a>',
                            listeners: {
                                render: function (display) {
                                    var clickElement = document.getElementById('click-verifySuccessNotificationConfig');
                                    clickElement.addEventListener('click', function () {
                                        controller.showMailTemplateConfigDetail(value.mailTemplateConfig)
                                    }, false);

                                }
                            }
                        }
                    }
                },
                {
                    text: i18n.getKey('rejected') + i18n.getKey('notifyEmailConfig'),
                    dataIndex: 'verifyFailedNotificationConfig',
                    xtype: 'componentcolumn',
                    width: 200,
                    itemId: 'verifyFailedNotificationConfig',
                    renderer: function (value, metra, record) {
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#" id="click-verifyFailedNotificationConfig" style="color: blue;text-decoration: none">' + i18n.getKey('check') + '</a>',
                            listeners: {
                                render: function (display) {
                                    var clickElement = document.getElementById('click-verifyFailedNotificationConfig');
                                    clickElement.addEventListener('click', function () {
                                        controller.showMailTemplateConfigDetail(value.mailTemplateConfig)
                                    }, false);

                                }
                            }
                        }
                    }
                },
                {
                    text: i18n.getKey('defaultRole'),
                    dataIndex: 'defaultRoleIds',
                    xtype: 'gridcolumn',
                    itemId: 'defaultRoleIds',
                    width: 200,
                    flex: 200,
                    renderer: function (value, metaData) {
                        var resultArray = [];
                        for (var i = 0; i < value.length; i++) {
                            Ext.Ajax.request({
                                url: adminPath + 'api/roles/' + value[i],
                                method: 'GET',
                                async: false,
                                params: {
                                    page: 1,
                                    limit: 10
                                },
                                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                success: function (res) {
                                    var responseMessage = Ext.JSON.decode(res.responseText);
                                    if (responseMessage.success) {
                                        resultArray.push(responseMessage.data.name)
                                    } else {
                                        Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message);
                                    }
                                },
                                failure: function (resp) {
                                    var response = Ext.JSON.decode(resp.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                }
                            });
                        }
                        metaData.tdAttr = 'data-qtip="' + resultArray + '"';
                        return resultArray;
                    }
                }
            ]
        },
        filterCfg: {
            items: [
                {
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'textfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id'),
                    isLike: false,
                    itemId: 'id'
                },
                {
                    name: 'websiteId',
                    xtype: 'websitecombo',
                    itemId: 'websiteCombo',
                    value: 11,
                    hidden: true,
                }
            ]
        }

    });
    window.downLoad = function (itemId) {
        var field = Ext.getCmp(itemId);
        var fileName = field.fileName;
        const a = document.createElement('a');
        a.setAttribute('href', imageServer + field.name);
        a.setAttribute("download", fileName);
        a.click();
    };
});
