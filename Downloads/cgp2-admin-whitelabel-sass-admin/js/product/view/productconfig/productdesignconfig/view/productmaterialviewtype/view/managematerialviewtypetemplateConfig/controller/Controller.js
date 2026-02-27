/**
 * Created by nan on 2020/2/20.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.managematerialviewtypetemplateConfig.controller.Controller', {
        /**
         * 保存操作
         */
        saveTemplateConfig: function (win, submitdata, mvtData, createOrEdit, grid) {
            win.el.mask('保存中...');
            //如果是新建的话，要在创建template后，在修改mvt
            var method = 'POST';
            var mvtId = win.mvtData._id;
            var url = adminPath + 'api/templateConfigController/' + mvtId;
            if (createOrEdit == 'edit') {
                url = url + '/' + win.record.getId();
                method = 'PUT';
            }
            Ext.Ajax.request({
                url: url,
                method: method,
                async: false,
                jsonData: submitdata,
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {
                        if (createOrEdit == 'create') {
                            var newTemplateID = responseMessage.data._id;
                            //判断是smvt的，还是普通的pmvt
                            var mvtUrl = null;
                            if (mvtData.clazz == 'com.qpp.cgp.domain.bom.ProductMaterialViewType') {//pmvt
                                mvtUrl = adminPath + 'api/productMaterialViewTypes/' + mvtData._id
                            } else {//smvt
                                mvtUrl = adminPath + 'api/simplifyMaterialViewType/' + mvtData._id
                            }
                            if (mvtData.productMaterialViewTemplateConfigIds) {
                                mvtData.productMaterialViewTemplateConfigIds.push(newTemplateID);
                            } else {
                                mvtData.productMaterialViewTemplateConfigIds = [];
                                mvtData.productMaterialViewTemplateConfigIds.push(newTemplateID);
                            }
                            grid.store.params = {
                                filter: Ext.JSON.encode([{
                                    name: 'includeIds',
                                    type: 'string',
                                    value: '[' + mvtData.productMaterialViewTemplateConfigIds.toString() + ']'
                                }])
                            };
                            grid.store.proxy.extraParams = grid.store.params;
                            Ext.Ajax.request({
                                url: mvtUrl,
                                method: 'PUT',
                                async: false,
                                jsonData: mvtData,
                                headers: {
                                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                },
                                success: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    if (responseMessage.success) {
                                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                                            win.close();
                                            grid.store.load();
                                        });
                                    } else {
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                    }
                                },
                                failure: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                }
                            })
                        } else {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                                if (win.lastWin) {
                                    win.lastWin.close();
                                }
                                grid.store.load();
                                win.close();
                            });
                        }
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
        /**
         *删除操作，
         * 不是真的删除templateConfig,只是去除掉mvt上的引用
         *
         */
        deleteTemplateConfig: function (deleteConfigIds, mvtData, grid) {
            //判断是smvt的，还是普通的pmvt
            var mvtUrl = null;
            if (mvtData.clazz == 'com.qpp.cgp.domain.bom.ProductMaterialViewType') {//pmvt
                mvtUrl = adminPath + 'api/productMaterialViewTypes/' + mvtData._id
            } else {//smvt
                mvtUrl = adminPath + 'api/simplifyMaterialViewType/' + mvtData._id
            }
            for (var i = 0; i < mvtData.productMaterialViewTemplateConfigIds.length; i++) {
                for (var j = 0; j < deleteConfigIds.length; j++) {
                    if (mvtData.productMaterialViewTemplateConfigIds[i].toString() == deleteConfigIds[j].toString()) {
                        mvtData.productMaterialViewTemplateConfigIds.splice(i, 1);
                        i--;
                        break;
                    }
                }
            }
            grid.store.params = {
                filter: Ext.JSON.encode([{
                    name: 'includeIds',
                    type: 'string',
                    value: '[' + mvtData.productMaterialViewTemplateConfigIds.toString() + ']'
                }])
            };
            grid.store.proxy.extraParams = grid.store.params;
            Ext.Ajax.request({
                url: mvtUrl,
                method: 'PUT',
                async: false,
                jsonData: mvtData,
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'), function () {
                            grid.store.load();
                        });
                    } else {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                },
                failure: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            })
        },
        /**
         * 配置分组id,模板类型，文件类型
         * @param grid
         * @param mvtData
         */
        showBaseConfigWindow: function (grid, mvtData) {
            Ext.widget('templateconfigwindow', {
                lastWin: this,
                createOrEdit: 'create',
                mvtData: mvtData,
                // 不需要拿到表单
                data: '',
                // 需要拿到表格
                grid: grid
            }).show();
        },
        /**
         *
         * @param groupId
         * @returns {Array}
         */
        getTemplateByGroupId: function (groupId) {
            var templateArr = [];
            var url = encodeURI(adminPath + 'api/templateConfigController?page=1&limit=10&filter=' + Ext.JSON.encode([{
                "name": "groupId",
                "value": groupId,
                "type": "string"
            }]));
            var method = 'GET';
            Ext.Ajax.request({
                url: url,
                method: method,
                async: false,
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {
                        templateArr = responseMessage.data.content;
                    } else {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                },
                failure: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            });
            
            return templateArr;
        },
        /**
         * 构建pmvt模板下载使用的上下文
         * @param productId
         * @returns {[]}
         */
        buildPMVTTContentData: function (productId) {
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
                        path: 'args.context.attributeValueContext',//该属性在上下文中的路径
                        attributeInfo: item
                    })
                }
            })
            return contentData;
        }
        
    }
)
