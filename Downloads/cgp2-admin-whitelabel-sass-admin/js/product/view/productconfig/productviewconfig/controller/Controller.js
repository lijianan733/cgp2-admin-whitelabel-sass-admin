/**
 * Created by nan on 2018/4/16.
 */
Ext.define('CGP.product.view.productconfig.productviewconfig.controller.Controller', {
    managerViewConfig: function (id, productViewConfigId, builderConfigTab) {
        var builderConfigTab = builderConfigTab;
        var urll = path + 'partials/product/productconfig/' + 'manageviewconfig' + '.html?id=' + id + '&productViewConfigId=' + productViewConfigId;
        var title = i18n.getKey('manage') + i18n.getKey('viewConing') + '(' + i18n.getKey('productViewCfg') + ':' + productViewConfigId + ')';
        var tab = builderConfigTab.getComponent('manageViewConfig');
        if (tab == null) {
            var tab = builderConfigTab.add({
                id: 'manageViewConfig',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + urll + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + urll + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        builderConfigTab.setActiveTab(tab);
    },
    /**
     *
     * @param store
     * @param record
     * @param createOrEdit
     * @param productViewConfigId
     * @param isLock 改配置是否锁定
     */
    editViewConfigWindow: function (store, record, createOrEdit, productViewConfigId, isLock) {
        var method = createOrEdit == 'edit' ? 'PUT' : 'POST';
        var url = adminPath + 'api/viewConfigs';
        var viewConfig = null;
        var productConfigViewId = productViewConfigId;
        viewConfig = {
            "productConfigViewId": productViewConfigId,
            "clazz": "com.qpp.cgp.domain.product.config.view.ViewConfig",
            "editViewConfigs": []
        };
        if (createOrEdit == 'edit') {
            var id = record.get('_id');
            url = adminPath + 'api/viewConfigs/' + id;
            Ext.Ajax.request({
                url: encodeURI(adminPath + 'api/viewConfigs?page=1&limit=25&filter=[{"name":"_id","value":"' + id + '","type":"string"}]'),
                method: 'GET',
                async: false,
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                success: function (response) {
                    viewConfig = Ext.JSON.decode(response.responseText).data.content[0];
                }
            });
        }
        JSShowJsonDataV2(viewConfig, i18n.getKey(createOrEdit) + '_' + i18n.getKey('viewConfig'), null, {
            height: 600,
            width: 800,
            showValue: true,
            editable: isLock ? false : true,
            readOnly: isLock ? true : false,
            bbar: {
                hidden: isLock ? true : false,
                items: ['->', {
                    xtype: 'button',
                    text: i18n.getKey('add'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var viewConfig = win.getValue();
                        viewConfig.productConfigViewId = parseInt(productConfigViewId);
                        viewConfig.clazz = 'com.qpp.cgp.domain.product.config.view.ViewConfig';
                        Ext.Ajax.request({
                            method: method,
                            url: url,
                            headers: {
                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                            },
                            jsonData: viewConfig,
                            success: function (response) {
                                var responseMessage = Ext.JSON.decode(response.responseText);
                                if (responseMessage.success) {
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'));
                                    store.load();
                                    win.close();
                                } else {
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                }
                            },
                            failure: function (response) {
                                var responseMessage = Ext.JSON.decode(response.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                            }
                        });
                    }
                }, {
                    xtype: 'button',
                    iconCls: "icon_cancel",
                    text: i18n.getKey('cancel'),
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        win.close();
                    }
                }]
            }
        });
    },
    editWizardConfigWindow: function (builderConfigId, productViewConfigId, builderConfigTab) {
        var wizardConfigs = '';
        var wizardConfigsId = '';
        var isLock = builderConfigTab.isLock;
        var url = adminPath + 'api/productConfigViews/' + productViewConfigId + '/wizardConfig';
        Ext.Ajax.request({
            url: url,
            method: 'GET',
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    wizardConfigs = responseMessage.data;
                    if (wizardConfigs) {
                        wizardConfigsId = wizardConfigs._id
                    }
                } else {
                    // Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }

            }
        });
        showWindow = function (wizardConfigsId) {
            var url = adminPath + 'api/wizardConfigs/' + wizardConfigsId;
            JSShowJsonDataV2(wizardConfigs, i18n.getKey('compile') + '_' + i18n.getKey('wizardConfig'), null, {
                editable: isLock ? false : true,
                readOnly: isLock ? true : false,
                height: 600,
                width: 800,
                showValue: true,
                bbar: {
                    hidden: isLock,
                    items: ['->', {
                        xtype: 'button',
                        text: i18n.getKey('save'),
                        iconCls: 'icon_agree',
                        handler: function (btn) {
                            var win = btn.ownerCt.ownerCt;
                            var wizardConfigs = win.getValue();
                            wizardConfigs.clazz = 'com.qpp.cgp.domain.product.config.view.WizardConfig';
                            Ext.Ajax.request({
                                method: "PUT",
                                url: url,
                                headers: {
                                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                },
                                jsonData: wizardConfigs,
                                success: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    if (responseMessage.success) {
                                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'));
                                    } else {
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                    }
                                },
                                failure: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                }
                            });
                        }
                    }, {
                        xtype: 'button',
                        iconCls: "icon_cancel",
                        text: i18n.getKey('cancel'),
                        handler: function (btn) {
                            var win = btn.ownerCt.ownerCt;
                            win.close();
                        }
                    }]
                }

            })
        };
        if (Ext.isEmpty(wizardConfigs)) {
            Ext.Msg.confirm(i18n.getKey('prompt'), '当前的wizardConfig为空，是否新建该配置？', function (select) {
                if (select == 'yes') {
                    if (isLock == true) {
                        Ext.Msg.alert(i18n.getKey('prompt'), '当前产品已被锁定,不允许新建配置');

                    } else {
                        Ext.Ajax.request({
                            url: adminPath + 'api/wizardConfigs',
                            method: 'POST',
                            async: false,
                            headers: {
                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                            },
                            jsonData: {
                                "productConfigViewId": productViewConfigId,
                                "clazz": "com.qpp.cgp.domain.product.config.view.WizardConfig"
                            },
                            success: function (response) {
                                wizardConfigs = Ext.JSON.decode(response.responseText).data;
                                wizardConfigsId = wizardConfigs._id;
                                showWindow(wizardConfigsId);
                            }
                        })
                    }
                } else {
                    return;
                }
            })
        } else {
            showWindow(wizardConfigsId);
        }
    },
    addFonts: function (records, grid, win) {
        var me = this;
        var datas = [];
        Ext.each(records, function (item) {
            datas.push(item.data)
        });
        grid.getStore().add(datas);
        win.close();
    },

})
