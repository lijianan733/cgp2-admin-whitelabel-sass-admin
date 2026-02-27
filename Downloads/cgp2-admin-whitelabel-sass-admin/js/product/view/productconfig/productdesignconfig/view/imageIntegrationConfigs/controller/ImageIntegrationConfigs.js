/**
 * ImageIntegrationConfigs
 * @Author: miao
 * @Date: 2022/3/28
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.DittoButton'
]);
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.imageIntegrationConfigs.controller.ImageIntegrationConfigs', {

    /**
     * 添加复制按钮
     * @param p
     */
    copyHandler: function (grid) {
        var store = grid.store;
        var selectItems = grid.getSelectionModel().getSelection();
        if (selectItems.length == 0) {
            Ext.Msg.alert(i18n.getKey('prompt'), '请选中需要复制的配置')
            return;
        }
        Ext.Msg.confirm(i18n.getKey('prompt'), '是否复制选中的配置', function (conf) {
            if (conf == 'yes') {
                var data = [], seletedData = [];
                Ext.Array.each(selectItems, function (item) {
                    data.push(item.get('_id'));
                    seletedData.push(item.data);
                });
                var requestUrl = adminPath + 'api/imageIntegrationConfigs/copy';
                Ext.Ajax.request({
                    url: requestUrl,
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    },
                    jsonData: data,
                    success: function (response) {
                        var responseMessage = Ext.JSON.decode(response.responseText);
                        if (responseMessage.success) {
                            store.load();
                            // var resultData=seletedData.concat(responseMessage.data);
                            // Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('copy') + i18n.getKey('success')+i18n.getKey('show')+i18n.getKey('copyed+copy')+i18n.getKey('data'), function (confirm) {
                            //     if (confirm == 'yes')
                            //         store.loadData(resultData,false);
                            // });
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
        })
    },

    batchAdd: function (store, productConfigDesignId, productBomConfigId, PageContentType) {
        var me = this;
        var model = Ext.ModelManager.getModel("CGP.product.view.productconfig.productdesignconfig.view.imageIntegrationConfigs.model.ImageIntegrationConfigsModel");

        var grid = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.BatchGrid', {
            store: Ext.create('Ext.data.Store', {
                autoSync: false,
                data: [],
                proxy: {
                    type: 'memory'
                },
                model: model
            }),
            columnsConfig: [
                {
                    dataIndex: 'side',
                    text: i18n.getKey('side')+'<font style="color: red;" fmp_c="0">*</font>',
                    width: 200,
                    sortable: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                        var rawRowNumber = record.get('rawRowNumber');
                        return {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'textfield',
                                    itemId: rawRowNumber + '_' + colIndex,
                                    name: 'side',
                                    width: 157,
                                    hideLabel: true,
                                    allowBlank: false,
                                    msgTarget: 'side',
                                    // value: value,
                                    // listeners: {
                                    //     change: Ext.Function.createBuffered(function (comp, newValue, oldValue) {
                                    //         record.set(comp.name, newValue);
                                    //     }, 1000)
                                    // }
                                },
                                {
                                    xtype: 'dittobtn',
                                    grid: grid
                                }
                            ]
                        }
                    }
                },
                {
                    dataIndex: 'productMaterialViewTypeId',
                    text: i18n.getKey('pmvtId')+'<font style="color: red;" fmp_c="0">*</font>',
                    width: 200,
                    sortable: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                        var rawRowNumber = record.get('rawRowNumber');
                        return {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            items: [
                                Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.common.PMVTCombo', {
                                    editable: false,
                                    hideLabel: true,
                                    name: 'productMaterialViewTypeId',
                                    itemId: rawRowNumber + '_' + colIndex,
                                    width: 157,
                                    productConfigDesignId: productConfigDesignId,
                                    allowBlank: false,
                                    msgTarget: 'side',

                                }),
                                {
                                    xtype: 'dittobtn',
                                    grid: grid
                                }
                            ]
                        }
                    }
                },
                {
                    dataIndex: 'dpi',
                    text: i18n.getKey('dpi'),
                    width: 200,
                    sortable: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                        var rawRowNumber = record.get('rawRowNumber');
                        return {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    itemId: rawRowNumber + '_' + colIndex,
                                    name: 'dpi',
                                    width: 157,
                                    hideLabel: true,
                                    hideTrigger: true,
                                    allowBlank: false,
                                    msgTarget: 'side',
                                    minValue: 0
                                },
                                {
                                    xtype: 'dittobtn',
                                    grid: grid
                                }
                            ]
                        }
                    }
                },
                {
                    dataIndex: 'minWidth',
                    text: i18n.getKey('width'),
                    width: 200,
                    sortable: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                        var rawRowNumber = record.get('rawRowNumber');
                        return {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    itemId: rawRowNumber + '_' + colIndex,
                                    name: 'minWidth',
                                    width: 157,
                                    hideLabel: true,
                                    hideTrigger: true,
                                    minValue: 0
                                },
                                {
                                    xtype: 'dittobtn',
                                    grid: grid
                                }
                            ]
                        }
                    }
                },
                {
                    dataIndex: 'minHeight',
                    text: i18n.getKey('height'),
                    width: 200,
                    sortable: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                        var rawRowNumber = record.get('rawRowNumber');
                        return {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    itemId: rawRowNumber + '_' + colIndex,
                                    name: 'minHeight',
                                    width: 157,
                                    hideLabel: true,
                                    hideTrigger: true,
                                    minValue: 0
                                },
                                {
                                    xtype: 'dittobtn',
                                    grid: grid
                                }
                            ]
                        }
                    }
                },
                {
                    dataIndex: 'ratioOffset',
                    text: i18n.getKey('ratioOffset')+'<font style="color: red;" fmp_c="0">*</font>',
                    width: 200,
                    sortable: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                        var rawRowNumber = record.get('rawRowNumber');
                        return {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    name: 'ratioOffset',
                                    itemId: rawRowNumber + '_' + colIndex,
                                    minValue: 0,
                                    step: 0.01,
                                    width: 157,
                                    hideLabel: true,
                                    allowBlank: false,
                                    hideTrigger: true,
                                    msgTarget: 'side'
                                },
                                {
                                    xtype: 'dittobtn',
                                    grid: grid
                                }
                            ]
                        }
                    }
                },
                {
                    dataIndex: 'imagePageContentPaths',
                    text: i18n.getKey('imagePageContentPaths')+'<font style="color: red;" fmp_c="0">*</font>',
                    width: 200,
                    sortable: false,
                    xtype: 'componentcolumn',
                    hidden: PageContentType != 'basePC',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                        var rawRowNumber = record.get('rawRowNumber');
                        return {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            items: [
                                Ext.create('CGP.common.field.ChildGridField', {
                                    name: 'imagePageContentPaths',
                                    itemId: rawRowNumber + '_' + colIndex,
                                    allowBlank: false,
                                    msgTarget: 'side',
                                    value: value,
                                    btnHandler: function (btn) {
                                        me.addChildGrid(record, btn)
                                    }
                                }),
                                {
                                    xtype: 'dittobtn',
                                    grid: grid
                                }
                            ]
                        }
                    }
                },

                {
                    dataIndex: 'pageContentEffectConfigs',
                    text: i18n.getKey('pageContentEffectConfigs')+'<font style="color: red;" fmp_c="0">*</font>',
                    width: 200,
                    sortable: false,
                    xtype: 'componentcolumn',
                    hidden: PageContentType == 'basePC',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                        var rawRowNumber = record.get('rawRowNumber');
                        return {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            items: [
                                Ext.create('CGP.common.field.ChildGridField', {
                                    name: 'pageContentEffectConfigs',
                                    itemId: rawRowNumber + '_' + colIndex,
                                    allowBlank: false,
                                    msgTarget: 'side',
                                    value: value,
                                    btnHandler: function (btn) {
                                        me.addEffectChildGrid(record, btn)
                                    }
                                }),
                                {
                                    xtype: 'dittobtn',
                                    grid: grid
                                }
                            ]
                        }
                    }
                }
            ],
            getValue: function () {
                var me = this, result = [];
                var colCount = me.columns.length;

                for (var i = 0; i < me.rowIndexArr.length; i++) {
                    var rowIndex = me.rowIndexArr[i];
                    var item = {
                        clazz: 'com.qpp.cgp.dto.product.ImageIntegrationConfigDTO',
                        productConfigDesignId: productConfigDesignId
                    };
                    for (var j = 0; j < colCount; j++) {
                        var editor = me.query('[itemId=' + (rowIndex + '_' + j) + ']')[0];
                        if (editor) {
                            //处理特殊的字段
                            if (editor.xtype == 'conditionfieldv3') {
                                var conditionDTO = editor.getValue();
                                if (conditionDTO) {
                                    item[editor.name] = conditionDTO;
                                    item['condition'] = editor.getExpression();
                                }
                            } else {
                                if (editor.diyGetValue) {
                                    item[editor.name] = editor.diyGetValue();
                                } else {
                                    item[editor.name] = editor.getValue();
                                }
                            }
                        }
                    }

                    result.push(item);
                }
                return result;
            },
        });
        Ext.create('Ext.ux.window.SuperWindow', {
            title: i18n.getKey('batchCreate'),
            maximizable: true,
            width: '90%',
            height: 460,
            bodyPadding: 0,
            confirmHandler: function (btn) {
                var wind = btn.ownerCt.ownerCt;
                if (wind.down('batchgrid').isValid()) {
                    var batchDatas = wind.down('batchgrid').getValue();
                    me.saveBatchData(batchDatas, store);
                    wind.close();
                }

            },
            items: [
                grid
            ]
        }).show();
    },

    saveBatchData: function (batchDatas, store) {
        var url = adminPath + 'api/imageIntegrationConfigs/batch';
        Ext.Ajax.request({
            url: url,
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: batchDatas,
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    store.load();
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
    },

    addChildGrid: function (record, currBtn) {
        // var data = record.get('imagePageContentPaths');
        var me = this;
        var data = currBtn.ownerCt?.getValue();
        if (data && Ext.isArray(data)) {
            var temp = [];
            data.forEach(function (item, index) {
                var obj = {};
                obj.value=item;
                obj.rawRowNumber = index;
                temp.push(obj);
            });
            data = temp;
        }
        var imagStore = Ext.create('Ext.data.Store', {
            autoSync: false,
            data: data || [],
            proxy: {
                type: 'memory'
            },
            fields: [
                {name: 'value', type: 'string'},
                {name: 'rawRowNumber', type: 'number'}
            ]
        });
        var grid = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.BatchGrid', {
            store: imagStore,
            columnsConfig: [
                {
                    dataIndex: 'value',
                    text: i18n.getKey('value'),
                    width: 200,
                    sortable: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                        var rawRowNumber = record.get('rawRowNumber');
                        return {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'textfield',
                                    itemId: rawRowNumber + '_' + colIndex,
                                    name: 'value',
                                    width: 157,
                                    hideLabel: true,
                                    allowBlank: false,
                                    value: value,

                                },
                                {
                                    xtype: 'dittobtn',
                                    grid: grid
                                }
                            ]
                        }
                    }
                }
            ]
        });
        me.showWindow(grid, currBtn);
    },
    showWindow: function (grid, currBtn) {
        Ext.create('Ext.ux.window.SuperWindow', {
            title: i18n.getKey('imagePageContentPaths') + i18n.getKey('edit'),
            maximizable: true,
            width: 500,
            height: 460,
            bodyPadding: 0,
            confirmHandler: function (btn) {
                var wind = btn.ownerCt.ownerCt;
                var grid = wind.items.items[0], data = [];
                if (grid?.getSubmitValue) {
                    data = grid.getSubmitValue();
                } else if (grid?.getValue) {
                    data = grid.getValue().map(function (item) {
                        if (Object.values(item) && Object.values(item).length > 0) {
                            return Object.values(item)[0];
                        } else {
                            return '';
                        }
                    })

                }
                currBtn.ownerCt.setValue(data);
                wind.close();
            },
            items: [
                grid
            ]
        }).show();
    },
    addEffectChildGrid: function (record, currBtn) {
        var me = this;
        var data = currBtn.ownerCt?.getValue();
        var imagStore = Ext.create('Ext.data.Store', {
            autoSync: false,
            data: data || [],
            proxy: {
                type: 'memory'
            },
            fields: [
                {name: 'effect', type: 'string'},
                {name: 'imagePageContentPaths', type: 'array'},
                {name: 'rawRowNumber', type: 'number'}
            ]
        });
        var pmvt = Ext.ComponentQuery.query('[itemId=' + currBtn.ownerCt.itemId.replace(/_{1}\d+/, '_2') + ']')[0].getValue();
        var pmvtId = pmvt[Object.keys(pmvt)[0]]?._id ?? 0;
        var grid = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.imageIntegrationConfigs.view.effectPCGrid', {
            store: imagStore,
            pmvtId: pmvtId
        });
        me.showWindow(grid, currBtn);
    }
})
;