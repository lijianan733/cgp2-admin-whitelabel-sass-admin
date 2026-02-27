Ext.define('CGP.product.view.productconfig.controller.Controller', {
    /**
     * 为window显示BuilderconfigTabs页面
     * @param {Ext.window.Window} window
     */
    previewBuilderConfigTabs: function (window) {
        Ext.Ajax.request({
            url: adminPath + 'api/productConfigs/products/' + window.productId,
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var response = Ext.JSON.decode(res.responseText);
                var success = response.success;
                var productConfigId = response.data.id;
                if (success == true) {
                    if (productConfigId != null) {
                        window.add(Ext.create('CGP.product.view.productconfig.ProductConfigTab', {
                            productId: window.productId,
                            productConfigId: productConfigId
                        }))
                    } else {
                        Ext.Msg.confirm('提示', 'builder配置为空，是否创建？', callback);

                        function callback(id) {
                            if (id === 'yes') {
                                Ext.Ajax.request({
                                    url: adminPath + 'api/productConfigs/products/' + window.productId,
                                    method: 'POST',
                                    jsonData: {},
                                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                    success: function (resp) {
                                        var response = Ext.JSON.decode(resp.responseText);
                                        var success = response.success;
                                        var productConfigId = response.data.id;
                                        window.add(Ext.create('CGP.product.view.productconfig.ProductConfigTab', {
                                            productId: window.productId,
                                            productConfigId: productConfigId
                                        }))
                                    }
                                })
                            } else {
                                window.close();
                            }
                        }
                    }
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },
    /*    /!**
         * 管理产品物料viewType
         * @param {Number} productConfigDesignId
         * @param {Ext.data.Model} productConfigDesignRecord productConfigDesign完整信息
         *!/
        managerProductMaterialViewType: function (productConfigDesignId, productConfigDesignRecord) {
            Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.ManagerProductMtViewType', {
                productConfigDesignId: productConfigDesignId,
                productConfigDesignRecord: productConfigDesignRecord
            }).show();
        },*/


    /**
     * 获取关联物料的materialPath
     * @param {Number} productBomConfigId productDesignConfig兼容的最新productBomConfig版本的ID
     * @param {String} materialPath
     */
    getMaterialPath: function (productBomConfigId, materialPath, component) {
        var spuIcon = path + 'ClientLibs/extjs/resources/themes/images/ux/S.png';
        var typeIcon = path + 'ClientLibs/extjs/resources/themes/images/ux/T.png';
        Ext.Ajax.request({
            url: adminPath + 'api/productConfigBoms/' + productBomConfigId,
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                var success = response.success;
                if (success) {
                    var materialId = response.data.productMaterialId;
                    Ext.Ajax.request({
                        url: adminPath + 'api/materials/' + materialId,
                        method: 'GET',
                        headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                        success: function (resp) {
                            var response = Ext.JSON.decode(resp.responseText);
                            var success = response.success;
                            if (success) {
                                var data = response.data;
                                var materialName = data.name;
                                var materialId = data._id;
                                var type;
                                if (data.clazz == 'com.qpp.cgp.domain.bom.MaterialType') {
                                    type = 'MaterialType'
                                } else if (data.clazz == 'com.qpp.cgp.domain.bom.MaterialSpu') {
                                    type = 'MaterialSpu'
                                }
                                Ext.create('CGP.product.view.productconfig.productdesignconfig.view.BomTree', {
                                    materialPath: materialPath,
                                    root: {
                                        _id: materialId,
                                        clazz: data.clazz,
                                        name: materialName,
                                        type: type,
                                        icon: type == 'MaterialSpu' ? spuIcon : typeIcon
                                    },
                                    bbar: ['->', {
                                        xtype: 'button',
                                        text: i18n.getKey('confirm'),
                                        iconCls: 'icon_agree',
                                        handler: function () {
                                            var win = this.ownerCt.ownerCt;
                                            var selectNode = win.getComponent('bomTree').getSelectionModel().getSelection()[0];
                                            if (!Ext.isEmpty(selectNode)) {
                                                if (selectNode.get('type') == 'MaterialType' || selectNode.get('type') == 'MaterialSpu') {
                                                    var valueArr = selectNode.getPath('pathID').split("/");
                                                    valueArr.splice(0, 1);
                                                    var value

                                                    if (component.getName() == 'materialId') {
                                                        value = valueArr[valueArr.length - 1];
                                                    } else {
                                                        value = valueArr.join(',');

                                                    }
                                                    component.setValue(value);
                                                    win.close();
                                                } else {
                                                    Ext.Msg.alert('提示', '请选择一个物料');
                                                }
                                            } else {
                                                Ext.Msg.alert('提示', '请选择一个物料');
                                            }
                                        }
                                    }, {
                                        xtype: 'button',
                                        text: i18n.getKey('cancel'),
                                        iconCls: 'icon_cancel',
                                        handler: function () {
                                            var win = this.ownerCt.ownerCt;
                                            win.close();
                                        }
                                    }]

                                }).show();
                            } else {
                                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                            }
                        },
                        failure: function (resp) {
                            var response = Ext.JSON.decode(resp.responseText);
                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                        }
                    });
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },
    managerPageContentSchemaGroup: function (store, productConfigDesignRecord) {
        Ext.create('CGP.product.view.productconfig.productdesignconfig.view.ManagerPageContentSchemaGroup', {
            productConfigDesignRecord: productConfigDesignRecord,
            store: store
        }).show();
    },
    editPageContentSchemaGroupWin: function (record, store, productConfigDesignId, productConfigDesignRecord) {
        var me = this;
        var editOrNew;
        if (Ext.isEmpty(record)) {
            editOrNew = 'new'
        } else {
            editOrNew = 'edit'
        }
        Ext.create('CGP.product.view.productconfig.productdesignconfig.view.EditPageContentSchemaGroup', {
            editOrNew: editOrNew,
            record: record,
            store: store,
            productConfigDesignId: productConfigDesignRecord.getId(),
            productConfigDesignRecord: productConfigDesignRecord,
            controller: me
        }).show();
    },
    /**
     *新建pageCintentSchemaGroup
     * @param {Object} data 新增或修改的数据
     * @param {Ext.data.Store} store 产品物料pageContentSchemaGroup store
     * @param {Ext.window.Window} win 编辑窗口
     */
    addPageContentSchemaGroup: function (data, store, win) {
        Ext.Ajax.request({
            url: adminPath + 'api/pageContentSchemaGroups',
            method: 'POST',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                var success = response.success;
                if (success) {
                    store.load();
                    win.close();
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },
    /**
     *修改pageCintentSchemaGroup
     * @param {Object} data 新增或修改的数据
     * @param {Ext.data.Store} store 产品物料pageContentSchemaGroup store
     * @param {Ext.window.Window} win 编辑窗口
     */
    updatePageContentSchemaGroup: function (data, store, win) {
        Ext.Ajax.request({
            url: adminPath + 'api/pageContentSchemaGroups/' + data['_id'],
            method: 'PUT',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                var success = response.success;
                if (success) {
                    store.load();
                    win.close();
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },
    deletePageContentSchemaGroup: function (pageContentSchemaGroupID, store) {
        Ext.Msg.confirm('提示', '是否删除？', callback);

        function callback(id) {
            if (id === 'yes') {
                Ext.Ajax.request({
                    url: adminPath + 'api/pageContentSchemaGroups/' + pageContentSchemaGroupID,
                    method: 'DELETE',
                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                    success: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        var success = response.success;
                        if (success) {
                            store.load();
                        } else {
                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                        }
                    },
                    failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                })
            }
        }
    },
    editBuilderLocation: function (store, record, editOrNew) {
        if (Ext.isEmpty(record)) {
            record = Ext.create('CGP.product.view.productconfig.productviewconfig.model.BuilderLocation', {
                title: "",
                sortOrder: "",
                locale: "",
                builderUrl: "",
                userPreviewUrl: "",
                clazz: "com.qpp.cgp.domain.product.config.LocaleBuilderLocationConfig",
                manufacturePreviewUrl: "",
                builderPublishStatus: 'UNCHANGED_NOTPUBLISH'
            });
        }
        Ext.create('CGP.product.view.productconfig.productviewconfig.view.EditBuilderConfig', {
            store: store,
            record: record,
            editOrNew: editOrNew
        }).show();
    },
    saveProductViewConfig: function (items, productViewCfgModel, mask, builderConfigTab) {
        var me = this, method = "POST", url;
        var data = {};
        Ext.Array.each(items, function (item) {
            if (item.name != 'builderLocations') {
                if (item.diyGetValue) {
                    data[item.name] = item.diyGetValue();
                } else {
                    data[item.name] = item.getValue();
                }
            }
            if (item.name == 'bomCompatibilities' || item.name == 'viewCompatibilities') {
                data[item.name] = item.getArrayValue();
            }
            if (productViewCfgModel != null) {
                data.builderConfig = productViewCfgModel.get('builderConfig');
                if (data.builderConfig) {
                    delete data.builderConfig?.fontDTOs;
                    delete data.builderConfig?.defaultFontDTO;
                    delete data.builderConfig?.builderLocationDTOs;
                    if (item.name == 'builderLocations') {
                        data.builderConfig.builderLocations = item.getSubmitValue();
                    }
                    if (item.name == 'fonts') {
                        data.builderConfig.fonts = item.getSubmitValue();
                    }
                    if (item.name == 'defaultFont') {
                        data.builderConfig.defaultFont = item.getValue();
                    }
                }
            }
        });
//		object.promotionId = 1;
        url = adminPath + 'api/productConfigViews';
        if (productViewCfgModel != null &&
            productViewCfgModel.modelName == "CGP.product.view.productconfig.productviewconfig.model.ProductViewCfgModel"
            && productViewCfgModel.get("id") != null) {

            data.id = productViewCfgModel.get("id");
            method = "PUT";
            url = url + "/" + data.id;
        }
        var request = {
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: data,
            success: function (response, options) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    mask.hide();
                    var id = resp.data.id;
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveSuccess'), function () {
                        builderConfigTab.addBuilderViewCfgEditTab(id, i18n.getKey('productViewCfg'));
                    });
                } else {
                    mask.hide();
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + resp.data.message)
                }
            },
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            },
            callback: function () {
                mask.hide();
            }
        };

        Ext.Ajax.request(request);
    },
    saveBuilderConfig: function (data, mask) {
        Ext.Ajax.request({
            url: adminPath + 'api/builderConfigs/' + data['_id'],
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: data,
            success: function (response, options) {
                mask.hide();
                var respData = Ext.JSON.decode(response.responseText);
                if (respData.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('savesuccess'))
                } else {
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + respData.data.message);
                }

            },
            failure: function (response, options) {
                mask.hide();
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            }
        })
    },
    /**
     * 在产品BOM配置中从物料ID直接点击查看物料详情
     * @param {String} materialId
     */
    checkMaterial: function (materialId) {
        var name;
        var id;
        var isLeaf;
        Ext.Ajax.request({
            url: adminPath + 'api/materials/' + materialId,
            method: 'GET',
            async: false,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (rep) {
                var response = Ext.JSON.decode(rep.responseText);
                if (response.success) {
                    var data = response.data;
                    name = data.name;
                    id = data['_id'];
                    isLeaf = data['leaf'];
                } else {
                    Ext.Msg.alert('提示', '请求失败！' + response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
        JSOpen({
            id: 'material' + '_edit',
            url: path + "partials/material/edit.html?materialId=" + id + '&isLeaf=' + isLeaf + '&parentId= &isOnly=true',
            title: i18n.getKey('materialInfo') + '(' + i18n.getKey('id') + ':' + id + ')',
            refresh: true
        });
    },
    editMaterialTypeToSpuConfig: function (data, store, editOrNew, productConfigDesignId, productBomConfigId) {
        var me = this;
        Ext.create('CGP.product.view.productconfig.productdesignconfig.view.materialtypetospuconfigs.edit', {
            store: store,
            data: data,
            productBomConfigId: productBomConfigId,
            controller: me,
            productConfigDesignId: productConfigDesignId,
            editOrNew: editOrNew
        }).show();
    },
    deleteMaterialTypeToSpuConfig: function (materialTypeToSpuConfigId, store) {
        Ext.Msg.confirm('提示', '是否删除？', callback);

        function callback(id) {
            if (id === 'yes') {
                Ext.Ajax.request({
                    url: adminPath + 'api/materialTypeToSpuConfigs/' + materialTypeToSpuConfigId,
                    method: 'DELETE',
                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                    success: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        var success = response.success;
                        if (success) {
                            store.load();
                        } else {
                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                        }
                    },
                    failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                })
            }
        }
    },
    updataMaterialTypeToSpuConfig: function (data, store, win) {
        Ext.Ajax.request({
            url: adminPath + 'api/materialTypeToSpuConfigs/' + data._id,
            method: 'PUT',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (rep) {
                var response = Ext.JSON.decode(rep.responseText);
                if (response.success) {
                    store.load();
                    win.close();
                    Ext.Msg.alert('提示', '修改成功！');
                } else {
                    Ext.Msg.alert('提示', '请求失败！' + response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },
    newMaterialTypeToSpuConfig: function (data, store, win) {
        Ext.Ajax.request({
            url: adminPath + 'api/materialTypeToSpuConfigs',
            method: 'POST',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (rep) {
                var response = Ext.JSON.decode(rep.responseText);
                if (response.success) {
                    store.load();
                    win.close();
                    Ext.Msg.alert('提示', '添加成功！');
                } else {
                    Ext.Msg.alert('提示', '请求失败！' + response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },
    searchGridCombo: function () {

        var queries = [];

        var items = this.ownerCt.items.items;

        var store = this.ownerCt.ownerCt.getStore();

        var params = {};

        for (var i = 0; i < items.length; i++) {
            var query = {};
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            query.name = items[i].name;
            if (!Ext.isEmpty(items[i].isLike) && !items[i].isLike) {
                query.value = items[i].getValue();
            } else if (Ext.isEmpty(items[i].isLike) || items[i].isLike) {
                query.value = '%' + items[i].getValue() + '%'
            }
            query.type = 'string';
            queries.push(query);
        }

        if (queries.length > 0) {
            store.proxy.extraParams = {
                filter: Ext.JSON.encode(queries)
            }
        } else {
            store.proxy.extraParams = null;
        }

        store.loadPage(1);


    },
    clearParams: function () {

        var items = this.ownerCt.items.items;
        var store = this.ownerCt.ownerCt.getStore();

        for (var i = 0; i < items.length; i++) {
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            items[i].setValue('');
        }

        store.proxy.extraParams = null;


    },
    selectMaterialPath: function (productBomConfigId, materialPath, jsonData, dataComp) {
        Ext.Ajax.request({
            url: adminPath + 'api/productConfigBoms/' + productBomConfigId,
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                var success = response.success;
                if (success) {
                    var materialId = response.data.productMaterialId;
                    Ext.Ajax.request({
                        url: adminPath + 'api/materials/' + materialId,
                        method: 'GET',
                        headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                        success: function (resp) {
                            var response = Ext.JSON.decode(resp.responseText);
                            var success = response.success;
                            if (success) {
                                var data = response.data;
                                var materialName = data.name;
                                var materialId = data._id;
                                var type;
                                if (data.clazz == 'com.qpp.cgp.domain.bom.MaterialType') {
                                    type = 'MaterialType'
                                } else if (data.clazz == 'com.qpp.cgp.domain.bom.MaterialSpu') {
                                    type = 'MaterialSpu'
                                }
                                Ext.create('CGP.product.view.productconfig.productdesignconfig.view.BomTree', {
                                    materialPath: materialPath,
                                    root: {
                                        _id: materialId,
                                        clazz: data.clazz,
                                        name: materialName,
                                        type: type,
                                        icon: type == 'MaterialSpu' ? '../productconfig/icon/S.png' : '../productconfig/icon/T.png'
                                    },
                                    bbar: ['->', {
                                        xtype: 'button',
                                        text: i18n.getKey('confirm'),
                                        handler: function () {
                                            var win = this.ownerCt.ownerCt;
                                            var selectNode = win.getComponent('bomTree').getSelectionModel().getSelection()[0];
                                            if (!Ext.isEmpty(selectNode)) {
                                                if (selectNode.get('type') == 'MaterialType' || selectNode.get('type') == 'MaterialSpu') {
                                                    var valueArr = selectNode.getPath('pathID').split("/");
                                                    valueArr.splice(0, 1);
                                                    var value = valueArr.join(',');
                                                    jsonData.materialPath = value;
                                                    Ext.Msg.confirm(i18n.getKey('prompt'), '是否要替换原有MaterialPath?', callback);

                                                    function callback(id) {
                                                        if (id == 'yes') {
                                                            dataComp.setValue(JSON.stringify(jsonData, null, "\t"));
                                                            win.close();
                                                        }
                                                    }
                                                } else {
                                                    Ext.Msg.alert('提示', '请选择一个物料');
                                                }
                                            } else {
                                                Ext.Msg.alert('提示', '请选择一个物料');
                                            }
                                        }
                                    }, {
                                        xtype: 'button',
                                        text: i18n.getKey('cancel'),
                                        handler: function () {
                                            var win = this.ownerCt.ownerCt;
                                            win.close();
                                        }
                                    }]

                                }).show();
                            } else {
                                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                            }
                        },
                        failure: function (resp) {
                            var response = Ext.JSON.decode(resp.responseText);
                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                        }
                    });
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },
    deleteImageIntegrationConfigs: function (materialTypeToSpuConfigId, store) {
        Ext.Msg.confirm('提示', '是否删除？', callback);

        function callback(id) {
            if (id === 'yes') {
                Ext.Ajax.request({
                    url: adminPath + 'api/imageIntegrationConfigs/' + materialTypeToSpuConfigId,
                    method: 'DELETE',
                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                    success: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        var success = response.success;
                        if (success) {
                            Ext.Msg.alert('提示', '删除成功');
                            store.load();
                        }
                    },
                    failure: function () {
                        Ext.Msg.alert('提示', '请求服务器失败！')
                    }
                })
            }
        }
    },
    editImageIntegrationConfigs: function (data, store, editOrNew, productConfigDesignId, productBomConfigIds, version) {
        var me = this;
        var tabpanel = window.parent.Ext.getCmp('builderConfigTab');
        var url = path + 'partials/product/productconfig/editImageIntegrationConfigs.html?editOrNew=' + editOrNew + '&recordId=' + (data == null ? 0 : data._id) + '&productConfigDesignId=' + productConfigDesignId;
        if (version) {
            url = path + 'partials/product/productconfig/editImageIntegrationConfigsV2.html?editOrNew=' + editOrNew + '&recordId=' + (data == null ? 0 : data._id) + '&productConfigDesignId=' + productConfigDesignId + '&productBomConfigId=' + productBomConfigIds;
        }
        var title = i18n.getKey(editOrNew) + i18n.getKey('ImageIntegrationConfigs');
        var tab = tabpanel.getComponent('editImageIntegrationConfigs')
        if (tab == null) {
            var tab = tabpanel.add({
                id: 'editImageIntegrationConfigs',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        tabpanel.setActiveTab(tab);

    },
    saveImageIntegrationConfigs: function (form, recordId) {
        var submitData = {};
        var field = form.items.items;
        for (var i = 0; i < field.length; i++) {
            var item = field[i];
            var name = field[i].getName();
            // if (recordId == 'null' && name == '_id') {
            //     continue;
            // }
            var value = '';
            if (item.diyGetValue) {
                value = item.diyGetValue();

            } else if (item.getValue) {
                value = item.getValue();
            }
            if (name == 'imagePageContentPaths') {
                var dataArray = [];
                for (var j = 0; j < field[i].gridConfig.store.data.length; j++) {
                    dataArray.push(field[i].gridConfig.store.getAt(j).get('value'));
                }
                value = dataArray;
            }
            if (name == 'pageContentEffectConfigs') {
                value = item.getSubmitValue();
            }
            submitData[name] = value;
        }
        submitData = Ext.Object.merge(submitData, submitData.definition);
        Ext.Object.each(submitData, function (key, value) {
            if (value == 0 || value == null) {
                delete submitData[key];
            }
        })
        delete submitData.definition;
        submitData['clazz'] = 'com.qpp.cgp.domain.product.config.ImageIntegrationConfig';
        var url = adminPath + 'api/imageIntegrationConfigs', method = 'POST';
        if (submitData._id) {
            url = adminPath + 'api/imageIntegrationConfigs/' + submitData._id;
            method = 'PUT';
        }
        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: submitData,
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    form.getComponent('_id').setValue(responseMessage.data['_id'])
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
        var tabpanel = window.parent.Ext.getCmp('builderConfigTab');
        var tab = tabpanel.getComponent('editImageIntegrationConfigs')
    },

    editImageUrl: function (pmvtId, record, store) {

        if (!pmvtId) {
            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('PMVT must be set first'));
            return false;
        }
        var tip = 'edit';
        Ext.define("earymodel", {
            extend: 'Ext.data.Model',
            fields: [
                {
                    name: 'clazz',
                    type: 'string',
                    defaultValue: 'com.qpp.cgp.domain.product.config.ImageIntegrationEffectConfig'
                },
                {name: 'imagePageContentPaths', type: 'array'},
                {name: 'effect', type: 'string'}
            ]
        });
        if (Ext.isEmpty(record)) {
            record = Ext.create('earymodel');
            tip = 'create';
        }
        var window = Ext.create('Ext.window.Window', {
            title: i18n.getKey(tip),
            height: 360,
            width: 500,
            modal: true,
            layout: 'fit',
            items: {
                xtype: 'form',
                autoScroll: true,
                defaults: {
                    margin: '10',
                    width: 410,
                    allowBlank: false,
                    labelAlign: 'right',
                },
                items: [
                    // {
                    //     xtype: 'textfield',
                    //     name: 'effect',
                    //     itemId: 'effect',
                    //     fieldLabel: i18n.getKey('effect'),
                    //     allowBlank: false,
                    //     value: (record?.get('effect')?? null)
                    // },
                    {
                        xtype: 'combo',
                        name: 'effect',
                        itemId: 'effect',
                        fieldLabel: i18n.getKey('effect'),
                        displayField: 'displayName',
                        valueField: 'value',
                        allowBlank: false,
                        value: (record?.get('effect') ?? null),
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value', 'displayName'],
                            data: [
                                {"value": 'CMYK', "displayName": i18n.getKey('CMYK')},
                                {"value": 'Preview', "displayName": i18n.getKey('Preview')}
                            ]
                        }),
                    },
                    Ext.create('CGP.product.view.productconfig.productdesignconfig.view.imageIntegrationConfigs.view.ImageFieldSet', {
                        name: 'imagePageContentPaths',
                        itemId: 'imagePageContentPaths',
                        allowBlank: false,
                        data: record?.get('imagePageContentPaths') ?? [],
                        pmvtId: pmvtId
                    })
                ],
                bbar: [
                    '->',
                    {
                        text: i18n.getKey('ok'),
                        itemId: 'okBtn',
                        iconCls: 'icon_agree',
                        handler: function (btn) {
                            var items = btn.ownerCt.ownerCt.items.items;

                            for (var i = 0; i < items.length; i++) {
                                if (items[i].isValid()) {
                                    var item = items[i];
                                    record.set(item.name, item.getValue());
                                } else {
                                    return;
                                }
                            }
                            if (tip == 'create') {
                                store.add(record);
                            }
                            window.close();
                        }
                    },
                    {
                        text: i18n.getKey('cancel'),
                        iconCls: 'icon_cancel',
                        handler: function (btn) {
                            window.close();
                        }
                    }]
            }
        }).show();

    },
    openEditImageUrlWindow: function (page, record, store) {
        var tip = 'edit';
        Ext.define("earymodel", {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'imageUrl', type: 'string'},
                {name: 'value', type: 'string'}
            ]
        });
        if (Ext.isEmpty(record)) {
            record = Ext.create('earymodel');
            tip = 'create';
        }
        var pcspreprocessController = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.controller.Controller');
        var pmvtId = (Ext.Object.getValues(page.down('form').down('[itemId="productMaterialViewTypeId"]').getValue())[0])?._id;
        if (Ext.isEmpty(pmvtId)) {
            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('PMVT must be set first'));
            return false;
        }
        var window = Ext.create('Ext.window.Window', {
            title: i18n.getKey(tip),
            height: 200,
            width: 450,
            modal: true,
            layout: 'fit',
            items: {
                xtype: 'form',
                padding: 5,
                border: 0,
                layout: 'fit',
                items: [
                    {
                        // name: 'selector',
                        xtype: 'jsonpathselector',
                        // fieldLabel: i18n.getKey('image'),
                        labelAlign: "right",
                        itemId: 'image',
                        rawData: pcspreprocessController.getPCSData(pmvtId),
                        value: (record ? record.get('value') : null),
                    },
                    // {
                    //     margin: 10,
                    //     width: 320,
                    //     height: 100,
                    //     autoScoll: true,
                    //     xtype: 'textarea',
                    //     allowBlack: false,
                    //     fieldLabel: i18n.getKey('imageUrl'),
                    //     value: (record ? record.get('value') : null)
                    // }
                ],
                bbar: ['->', {
                    text: i18n.getKey('ok'),
                    itemId: 'okBtn',
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var changedValue = this.ownerCt.ownerCt.down('jsonpathselector').diyGetValue();

                        if (tip == 'create') {
                            record.set('value', changedValue);
                            store.add(record);
                        } else {
                            record.set('value', changedValue);
                        }
                        window.close();
                    }
                },
                    {
                        text: i18n.getKey('cancel'),
                        iconCls: 'icon_cancel',
                        handler: function (btn) {
                            window.close();
                        }
                    }]
            }
        }).show();

    },
    addSingleProductCopyButton: function (p, productConfigId, url) {
        var grid = p.grid;
        var store = grid.store;
        var configurationId = productConfigId;
        var button = Ext.widget({
            xtype: 'button',
            text: i18n.getKey('copy') + i18n.getKey('config'),
            iconCls: 'icon_copy',
            handler: function () {
                var selectItems = grid.getSelectionModel().getSelection();
                if (selectItems.length == 0) {
                    Ext.Msg.alert(i18n.getKey('prompt'), '请选中需要复制的配置')
                    return;
                }
                Ext.Msg.confirm(i18n.getKey('prompt'), '是否复制选中的配置', function (id) {
                    if (id == 'yes') {
                        var version = selectItems[0].get('configVersion');
                        var requestUrl = adminPath + url + configurationId + '/' + version + '/duplication';
                        Ext.Ajax.request({
                            url: requestUrl,
                            method: 'POST',
                            headers: {
                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                            },
                            success: function (response) {
                                var responseMessage = Ext.JSON.decode(response.responseText);
                                if (responseMessage.success) {
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('copy') + i18n.getKey('success'), function () {
                                        store.load();
                                    });

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
            width: 90
        })
        p.toolbar.insert(7, button);
    },
    /**
     * 创建PMVT条件本地上下文模板数据
     */
    buildPMVTContentData: function (productId) {
        var contentData = [];
        var url = adminPath + 'api/products/configurable/' + productId + '/skuAttributes';
        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            var responseText = Ext.JSON.decode(response.responseText);
            var attributes = responseText.data;
            for (var i = 0; i < attributes.length; i++) {
                var item = attributes[i];
                var attribute = item.attribute;
                contentData.push({
                    key: attribute.id,
                    type: 'skuAttribute',
                    valueType: attribute.valueType,
                    selectType: attribute.selectType,
                    attrOptions: attribute.options,
                    required: item.required,
                    displayName: item.displayName + '(' + item.id + ')',//sku属性
                    path: 'args.context',//该属性在上下文中的路径
                    attributeInfo: item
                })
            }
        })
        contentData.push({
            key: 'qty',
            type: 'skuAttribute',
            valueType: 'Number',
            selectType: 'NON',
            attrOptions: [],
            required: true,
            displayName: 'Qty',
            path: 'args.context',//该属性在上下文中的路径
            attributeInfo: {}
        });
        return contentData;
    }

});
