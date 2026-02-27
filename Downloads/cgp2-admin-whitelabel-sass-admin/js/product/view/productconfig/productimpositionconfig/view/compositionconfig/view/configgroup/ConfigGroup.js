Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.configgroup.ConfigGroup', {
    extend: 'Ext.panel.Panel',
    title: i18n.getKey('Job生成配置分组'),
    name: 'ConfigGroup',
    itemId: 'ConfigGroup',
    layout: 'vbox',
    autoScroll: true,
    filter: null,
    preview: null,
    productId: null,
    contentData: null,
    impositionId: null,
    createConfigGroupTitle: null,
    generateJobConfigStore: null,
    initComponent: function () {
        var me = this;
        me.tbar = [
            {
                xtype: 'button',
                iconCls: 'icon_save',
                text: me.createConfigGroupTitle,
                handler: function (btn) {
                    var page = btn.ownerCt.ownerCt;
                    Ext.create('Ext.window.Window', {
                        title: me.createConfigGroupTitle,
                        modal: true,
                        autoScroll: true,
                        width: 1000,
                        height: 600,
                        layout: 'fit',
                        items: [
                            {
                                xtype: 'configgroup',
                                name: 'configgroup',
                                itemId: 'configgroup',
                                collapsible: false,
                                disabled: false,
                                collapsed: false,
                                border: false,
                                filter: me.filter,
                                preview: me.preview,
                                productId: me.productId,
                                contentData: me.contentData,
                                impositionId: me.impositionId,
                                generateJobConfigStore: me.generateJobConfigStore,
                            }
                        ],
                        bbar: [
                            '->',
                            {
                                text: i18n.getKey('save'),
                                iconCls: 'icon_save',
                                handler: function (btn) {
                                    var win = btn.ownerCt.ownerCt;
                                    var configgroup = win.getComponent('configgroup');

                                    // 配置分组基本信息POST请求方法
                                    function configGroupBaseInfoPostRequest(configgroup) {
                                        var data = configgroup.getValue();
                                        var url = cgp2ComposingPath + 'api/jobGenerateConfigGroups';
                                        JSAjaxRequest(url, 'POST', false, data, i18n.getKey('addsuccessful'), function (require, success, response) {
                                            if (success == true) {
                                                var responseText = Ext.JSON.decode(response.responseText);
                                                if (responseText.success == true) {
                                                    jobGenerateConfigPostRequest(responseText, data);
                                                }
                                            }
                                        }, true)
                                    }

                                    // job生成配置列表POST请求方法
                                    function jobGenerateConfigPostRequest(responseText, data) {
                                        var responseTextData = responseText.data;
                                        var jobGenerateConfigsId = [];
                                        var jobGenerateConfigsUrl = cgp2ComposingPath + 'api/jobGenerateConfigGroups/' + responseTextData._id + '/jobGenerateConfigItems';
                                        responseTextData.jobGenerateConfigs = data.jobGenerateConfigs;
                                        data.jobGenerateConfigs.forEach(item => {
                                            jobGenerateConfigsId.push(item._id);
                                        });
                                        var jobGenerateConfigData = {
                                            'jobGenerateConfigIds': jobGenerateConfigsId
                                        };
                                        JSAjaxRequest(jobGenerateConfigsUrl, 'POST', false, jobGenerateConfigData, null, function (require, success, response) {
                                            if (success == true) {
                                                var responseText = Ext.JSON.decode(response.responseText);
                                                if (responseText.success == true) {
                                                    createConfigGroupItem(responseTextData, page, true);
                                                    win.hide();
                                                }
                                            }
                                        })
                                    }

                                    if (configgroup.isValid()) {
                                        configGroupBaseInfoPostRequest(configgroup);
                                    }
                                }
                            },
                            {
                                text: i18n.getKey('cancel'),
                                iconCls: 'icon_cancel',
                                handler: function (btn) {
                                    var win = btn.ownerCt.ownerCt;
                                    win.hide();
                                }
                            }
                        ]
                    }).show()
                }
            }
        ];
        /**
         * 创建分组方法
         * @param getData   setValue需要的数据
         * @param page      被添加到哪个页面
         * @param isCreate  是否为新建页面
         */
        var createConfigGroupItem = function (getData, page, isCreate) {
            if (getData.name && getData._id) {
                var relationGroupItem = Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.configgroup.component.ConfigGroupItem', {
                    title: isCreate ? `<a style='color:green'>` + getData.name + `</a>` : getData.name,
                    disabled: false,
                    autoScroll: true,
                    collapsed: false,
                    saveBtnIsShow: false,
                    deleteBtnIsShow: false,
                    filter: me.filter,
                    preview: me.preview,
                    productId: me.productId,
                    contentData: me.contentData,
                    impositionId: me.impositionId,
                    generateJobConfigStore: me.generateJobConfigStore,
                    saveBtnFun: function (btn) {
                        var relationGroupItem = btn.ownerCt.ownerCt;
                        if (relationGroupItem.isValid()) {
                            var data = relationGroupItem.getValue();
                            var url = cgp2ComposingPath + 'api/jobGenerateConfigGroups/' + data._id;
                            data.clazz = 'com.qpp.cgp.composing.config.group.JobGenerateConfigGroup';
                            JSAjaxRequest(url, 'PUT', false, data, null, function (require, success, response) {
                                if (success == true) {
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    if (responseText.success == true) {
                                        relationGroupItem.setTitle(`<a style='color:green'>` + data.name + `</a>`)
                                    }
                                }
                            }, true)
                        }
                    },
                    deleteBtnFun: function (btn) {
                        var relationGroupItem = btn.ownerCt.ownerCt;
                        var url = cgp2ComposingPath + 'api/jobGenerateConfigGroups/' + getData._id;
                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                            if (selector == 'yes') {
                                var container = relationGroupItem.ownerCt;
                                container.remove(relationGroupItem);
                                JSAjaxRequest(url, 'DELETE', false, null, null, function (require, success, response) {
                                    if (success == true) {
                                        var responseText = Ext.JSON.decode(response.responseText);
                                        if (responseText.success == true) {
                                            // console.log(responseText);
                                        }
                                    }
                                }, true)
                            }
                        })
                    },
                    jobGenerateConfigsSaveHandler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var grid = win.getComponent('grid').grid;
                        var selection = grid.selectedRecords;
                        var jobGenerateConfigsId = [];
                        var jobGenerateConfigsUrl = null;
                        var jobGenerateConfigData = null;
                        var itemId = null;
                        if (selection.length > 0) {
                            for (var i = 0; i < selection.length; i++) {
                                win.outGrid.store.proxy.data.push(selection.getAt(i).getData());
                            }
                            win.outGrid.store.load();
                            jobGenerateConfigsUrl = cgp2ComposingPath + 'api/jobGenerateConfigGroups/' + getData._id + '/jobGenerateConfigItems';
                            win.outGrid.store.proxy.data.forEach(item => {
                                if (!item._id) {
                                    item.singleJobConfigs.forEach(item2 => {
                                        itemId = item2._id;
                                        jobGenerateConfigsId.push(itemId);
                                    })
                                } else {
                                    itemId = item._id;
                                    jobGenerateConfigsId.push(itemId);
                                }
                            });
                            jobGenerateConfigData = {
                                'jobGenerateConfigIds': jobGenerateConfigsId
                            };
                            JSAjaxRequest(jobGenerateConfigsUrl, 'POST', false, jobGenerateConfigData, i18n.getKey('addsuccessful'), function (require, success, response) {
                                if (success == true) {
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    if (responseText.success == true) {
                                    }
                                }
                            });
                        }
                        win.close();
                    },
                    jobGenerateConfigsDeleteHandler: function (view, rowIndex, colIndex, el, event, record, dom) {
                        var page = view.ownerCt.ownerCt.ownerCt;
                        var id = page.getValue()._id;
                        var url = null;
                        var store = view.getStore();
                        var jobGenerateConfig = null;
                        var jobGenerateConfigId = record.data._id;

                        function deleteItem(jobGenerateConfigId) {
                            url = cgp2ComposingPath + 'api/jobGenerateConfigGroups/' + id + '/jobGenerateConfigItems/' + jobGenerateConfigId;
                            JSAjaxRequest(url, 'DELETE', false, null, null, function (require, success, response) {
                                if (success == true) {
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    if (responseText.success == true) {
                                        // console.log(responseText);
                                    }
                                }
                            }, false)
                        };

                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                            if (selector == 'yes') {
                                if (!jobGenerateConfigId) {
                                    jobGenerateConfig = record.data.singleJobConfigs;
                                    jobGenerateConfig.forEach(item => {
                                        deleteItem(item._id);
                                    })
                                } else {
                                    deleteItem(jobGenerateConfigId);
                                }
                                store.removeAt(rowIndex);
                                if (store.proxy.data) {//处理本地数据
                                    store.proxy.data.splice(rowIndex, 1);
                                }
                            }
                        })
                    }
                });
                page.add(relationGroupItem);
                relationGroupItem.setValue(getData);
            }
        };
        var iterateConfigGroup = function () {
            var configGroupUrl = cgp2ComposingPath + 'api/jobGenerateConfigGroupDTOs?page=1&limit=100&filter=[{"name":"productConfigImpositionId","value":' + me.impositionId + ',"type":"number"}]';
            JSAjaxRequest(configGroupUrl, 'GET', false, null, null, function (require, success, response) {
                JSSetLoading(true);
                if (success) {
                    var responseText = Ext.JSON.decode(response.responseText);
                    if (responseText.success) {
                        var data = responseText.data.content;
                        var dataCount = 0;
                        if (data.length != 0) {
                            var time = setInterval(() => {
                                var dataItem = data[dataCount];
                                createConfigGroupItem(dataItem, me, false);
                                if (dataCount == data.length - 1) {
                                    clearInterval(time);
                                    JSSetLoading(false);
                                }
                                dataCount++;
                            }, 500)
                        } else {
                            JSSetLoading(false);
                        }
                    }
                }
            }, false)
        };
        iterateConfigGroup();
        me.callParent();
    }
})