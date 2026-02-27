Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.controller.Controller', {
    PMVTTContentData: null,
    transformController: Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.controller.TransformController'),
    /**
     * 把自定义的JSON数据转换出对应的DTO界面配置数据
     */
    domainToDTO: function (JSONData, DTO) {
        var controller = this;
        var DTOData = {
            builderViewConfigDomain: JSONData,
            clazz: "com.qpp.cgp.domain.product.config.view.builder.dto.v3.OrdinaryBuilderViewConfigDTO",
            description: JSONData.description,
            editViewConfigs: [],
            productConfigViewId: JSONData.productConfigViewId,
            _id: DTO ? DTO._id : null
        };
        var DTOEditViewConfigs = [];
        //把同一个navItemId的page分为一组
        var mapping = {};
        if (JSONData.editViewConfigs) {
            for (var i = 0; i < JSONData.editViewConfigs.length; i++) {
                var JSONEditViewConfig = JSONData.editViewConfigs[i];
                var editViewType = JSONEditViewConfig.editViewType;
                for (var j = 0; j < JSONEditViewConfig.configs.length; j++) {
                    var config = JSONEditViewConfig.configs[j];
                    if (mapping[config.navItemId]) {

                    } else {
                        mapping[config.navItemId] = {
                            configs: [],
                            editViewType: controller.getEditViewTypeDTOConfig(editViewType._id),
                            navItemId: config.navItemId,
                        };
                    }
                    //对config中的componentPath处理

                    if (config.componentPath.clazz == 'com.qpp.cgp.domain.product.config.view.builder.config.v3.NamePath') {

                    } else {
                        var FullPath = {
                            "$.areas[?(@.position.layoutPosition=='Top')].components[0]": "$.areas[?(@.position.layoutPosition=='Top')].components[?(@.name=='Top')]",//这个配置是为了处理配置人员已经配置了的大量不兼容数据
                            "$.areas[?(@.position.layoutPosition=='Top')].components[0]": "$.areas[?(@.position.layoutPosition=='Top')].components[?(@.name=='NavBar')]",
                            /*   "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='H3')]": "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='H3')]",
                               "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='H4')]": "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='H4')]",*/
                            "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='ToolTips')]": "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='ToolTips')]",
                            "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='ToolBar')]": "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='ToolBar')]",
                            "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='AssistBar')]": "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='AssistBar')]",
                            "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='DocumentComponent')]": "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='DocumentComponent')]",
                            "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='DocumentTop')]": "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='DocumentTop')]",
                            "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='DocumentBottom')]": "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='DocumentBottom')]",
                            "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='DocumentLeft')]": "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='DocumentLeft')]",
                            "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='DocumentRight')]": "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='DocumentRight')]",
                        };
                        if (FullPath[config.componentPath.path]) {
                            //以上6种使用fullPath
                            config.componentPath.path = FullPath[config.componentPath.path];
                        }
                    }
                    mapping[config.navItemId].configs.push(config);
                }
            }
        }
        console.log(mapping);
        for (var i in mapping) {
            DTOEditViewConfigs.push(mapping[i]);
        }
        DTOData.editViewConfigs = DTOEditViewConfigs;
        return DTOData;
    },
    /**
     * 通过domainId找到DTO配置
     * @param domainId
     */
    getEditViewTypeDTOConfig: function (domainId) {
        var url = adminPath + 'api/editViewTypeDtos/V3?page=1&start=0&limit=25&filter=' + Ext.JSON.encode([{
            name: 'editViewTypeDomain._id',
            type: 'string',
            value: domainId
        }]);
        var result = JSAjaxRequest(url, 'GET', false, null, null);
        /* if (result[0]) {
             result = {
                 clazz: "com.qpp.cgp.domain.product.config.view.builder.dto.v3.EditViewTypeDto",
                 description: result[0].description,
                 editViewTypeDomain: {
                     _id: result[0].editViewTypeDomain._id,
                     clazz: "com.qpp.cgp.domain.product.config.view.builder.config.v3.EditViewType",
                 },
                 _id: result[0]._id
             }
         }*/
        return result[0];
    },
    /**
     *
     * 找到DTO配置
     * @returns {*}
     */
    getBuilderViewConfigDTO: function (productViewConfigId) {
        var url = adminPath + 'api/builderViewConfigDtos/v3?page=1&start=0&limit=25&filter=' + Ext.JSON.encode([{
            name: 'productConfigViewId',
            type: 'number',
            value: productViewConfigId
        }]);
        var result = JSAjaxRequest(url, 'GET', false, null, null);
        return result[0];
    },

    /**
     * 保存DTO配置，界面保存
     * @param panel
     * @param data
     * @returns {boolean}
     */
    saveBuilderViewConfigDTO: function (panel, data, message) {
        var result = true;
        var controller = this;
        controller.setIdValue(data);//为组件设置id
        controller.builderComponentArr(data);//用一个数组，记录所有用到的组件
        data.builderViewConfigDomain = controller.transformController.DTOTransformDomain(data);
        controller.setIdValue(data);//为domain中的viewConfig设置id
        console.log(data);
        var message = message || i18n.getKey('saveSuccess');
        var method = 'POST';
        panel.el.mask();
        panel.updateLayout();
        var url = adminPath + 'api/builderViewConfigDtos/v3';
        if (panel.createOrEdit == 'edit') {
            method = 'PUT';
            data._id = panel.recordData._id;
            url = adminPath + 'api/builderViewConfigDtos/v3/' + panel.recordData._id;
        }
        Ext.Ajax.request({
            url: url,
            method: method,
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: data,
            success: function (response) {
                panel.el.unmask();
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), message, function () {
                        panel.recordData = responseMessage.data;
                        panel.items.items[0].recordData = panel.recordData;
                        panel.createOrEdit = 'edit';
                        //全部组件数组
                        window.componentArr = panel.recordData.componentConfigs;
                    });
                    ``
                    result = true;
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    result = false;
                }
            },
            failure: function (response) {
                panel.el.unmask();
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                result = false;
            }
        });
        return result;
    },
    /**
     * 直接使用json的domain数据保存
     */
    saveBuilderViewConfigDomain: function (jsonData) {
        var controller = this;
        var url = '';
        var method = '';
        var message = '';
        var result = true;
        if (jsonData._id) {
            url = adminPath + 'api/builderViewConfigs/v3/' + jsonData._id;
            method = 'PUT';
            message = i18n.getKey('modifySuccess');
        } else {
            url = adminPath + 'api/builderViewConfigs/v3';
            method = 'POST';
            message = i18n.getKey('addsuccessful');
        }
        JSAjaxRequest(url, method, false, jsonData, message, function (require, success, response) {
            result = success;
        });
        return result;
    },
    /**
     * 为所有空的Id字段赋值
     */
    setIdValue: function (data) {
        var controller = this;
        for (var i in data) {
            if (Object.prototype.toString.call(data[i]) === '[object Array]') {//数组
                for (var j = 0; j < data[i].length; j++) {
                    //数组,//对象
                    if ((typeof (data[i][j]) === 'object')) {
                        controller.setIdValue(data[i][j]);
                    }
                    //普通数据
                }
            } else if (Object.prototype.toString.call(data[i]) === '[object Object]') {
                controller.setIdValue(data[i]);
            } else {
                if (i == 'id' && Ext.isEmpty(data[i])) {
                    data[i] = JSGetCommonKey(false);
                }
            }
        }

    },
    /**
     * 直接通过json数据进修改BuildViewConfig
     * @param productViewConfigId
     */
    editViewConfigByJSON: function (productViewConfigId, isLock) {
        var controller = this;
        var viewConfig = '';
        Ext.apply(Ext.form.VTypes, {
            json: function (value) {//验证方法名
                try {
                    var a = JSON.parse(value);
                    if (Object.prototype.toString.call(a) == '[object Object]' && !Ext.Object.isEmpty(a)) {
                        return true;
                    }
                } catch (e) {
                    return false;
                }

            },
            jsonText: '非法JSON数据'
        });
        var getViewConfig = function (productConfigViewId) {
            var result = null;
            var filter = [{"name": "productConfigViewId", "value": productConfigViewId, "type": "number"}];
            var url = encodeURI(adminPath + 'api/builderViewConfigs/v3?page=1&limit=23&filter=' + Ext.JSON.encode(filter));
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
                        result = responseMessage.data.content[0];
                        if (result) {
                        } else {
                            result = {
                                "clazz": "com.qpp.cgp.domain.product.config.view.builder.config.v3.OrdinaryBuilderViewConfig",
                                "productConfigViewId": productConfigViewId,
                            }
                        }
                    }
                }
            })
            return result;
        };
        var saveViewConfigByJSON = function (JSONData, DTODate, win) {
            var method = 'POST';
            var url = adminPath + 'api/builderViewConfigDtos/v3';
            if (DTODate._id) {
                method = 'PUT';
                url = adminPath + 'api/builderViewConfigDtos/v3/' + DTODate._id;
            }
            Ext.Ajax.request({
                method: method,
                url: url,
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                jsonData: DTODate,
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                            win.close();
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
        };
        viewConfig = getViewConfig(productViewConfigId);
        JSShowJsonDataV2(viewConfig, i18n.getKey('compile') + '_' + i18n.getKey('viewConfig'), null, {
            editable: isLock ? false : true,
            showValue: true,
            readOnly: isLock ? true : false,
            bbar: {
                hidden: isLock,
                items: ['->', {
                    xtype: 'button',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var JSONData = win.getValue();
                        JSONData.productConfigViewId = productViewConfigId;
                        //获取DTO数据
                        try {
                            //v3的暂时没
                            var result = controller.saveBuilderViewConfigDomain(JSONData);
                            if (result) {
                                win.close();
                            }
                            /* var DTOData = controller.domainToDTO(JSONData, controller.getBuilderViewConfigDTO(productViewConfigId));
                             saveViewConfigByJSON(JSONData, DTOData, win);*/
                        } catch (e) {
                            Ext.Msg.alert(i18n.getKey('prompt'), e.message);
                        }
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
    },
    /**
     * 构建3D模板组件配置中条件上下文
     * @param productId
     * @returns {[]}
     */
    buildPMVTTContentData: function (productId) {
        var contentData = [];
        var controller = this;
        if (controller.PMVTTContentData) {
            return Ext.clone(controller.PMVTTContentData);
        } else {
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
                        path: 'args.context.properties',//该属性在上下文中的路径
                        attributeInfo: item
                    })
                }
            });
            controller.PMVTTContentData = contentData;
            return controller.PMVTTContentData;
        }
    },
    /**
     * 界面配置数据修改，更新到componentArr中
     * 把配置中所有的组件配置记录到一个新的数组中
     */
    builderComponentArr: function (data) {
        data.componentConfigs = window.componentArr;
        data.customComponentArr = [];
        //查找出修改了的组件

        var componentConfigs = window.componentArr;
        //遍历产品view配置中的组件
        var mapping = {};//记录被修改的组件，遍历完成后统一修改
        for (var i = 0; i < data.editViewConfigs.length; i++) {
            var editViewConfigItem = data.editViewConfigs[i];
            var configs = editViewConfigItem.configs;//存放组件配置的属性
            for (var j = 0; j < configs.length; j++) {
                //获取到当个组件信息
                var componentData = configs[j];
                if (componentConfigs.length > 0) {
                    componentConfigs.forEach(function (item, index, array) {
                        if (item._id == componentData._id) {
                            //找出相同id的配置，然后比较其配置是否相同，不比较path
                            var copyComponentData = Ext.clone(componentData);
                            delete copyComponentData.componentPath;
                            delete copyComponentData.configId;
                            if (JSObjectValueEqual(copyComponentData, item)) {

                            } else {
                                console.log('修改');
                                mapping[index] = item;
                            }
                        }
                    })
                }
            }
        }
        for (var i in mapping) {
            window.componentArr[i] = mapping[i];
        }
        console.log(componentConfigs);
    },
    /**
     * 获取组件的使用情况
     * @param navigationTree
     * @returns {{}}
     */
    getComponentUsingInfo: function (navigationTree) {
        //找出该id的组件的引用情况
        var me = this;
        var currentData = null;
        currentData = navigationTree.getValue();
        var componentArr = window.componentArr;
        var info = {};
        var navigationStore = Ext.data.StoreManager.get('navigationStore');
        var builder = function (currentData, componentId) {
            var navigate = {};
            for (var i = 0; i < currentData.editViewConfigs.length; i++) {
                var editViewConfigItem = currentData.editViewConfigs[i];
                var configs = editViewConfigItem.configs;//存放组件配置的属性
                for (var j = 0; j < configs.length; j++) {
                    //获取到当个组件信息
                    if (configs[j]._id == componentId) {
                        if (Ext.isEmpty(navigate[editViewConfigItem.navItemId])) {
                            navigate[editViewConfigItem.navItemId] = {
                                count: 1,
                                description: navigationStore.getNodeById(editViewConfigItem.navItemId).get('description') || ''
                            };
                        } else {
                            navigate[editViewConfigItem.navItemId].count++;
                        }
                    }
                    //如果是assistanBar还有遍历其关联组件
                    if (configs[j].clazz == 'com.qpp.cgp.domain.product.config.view.builder.config.v3.AssistBarConfig') {
                        //assisant中的关联组件列表
                        var assistants = configs[j].assistants;
                        for (var k = 0; k < assistants.length; k++) {
                            var relateComponent = assistants[k].relateComponent;
                            if (relateComponent._id == componentId) {
                                if (Ext.isEmpty(navigate[editViewConfigItem.navItemId])) {
                                    navigate[editViewConfigItem.navItemId] = {
                                        count: 1,
                                        description: navigationStore.getNodeById(editViewConfigItem.navItemId).get('description') || ''
                                    };
                                } else {
                                    navigate[editViewConfigItem.navItemId].count++;
                                }
                            }
                        }
                    }
                }
            }
            return navigate;
        };
        for (var i = 0; i < componentArr.length; i++) {
            var componentId = componentArr[i]._id;
            info[componentId] = builder(currentData, componentId);
        }
        console.log(info);
        return info;
    },
    compareComponent: function (data) {
        var result = false;
        for (var i = 0; i < window.componentArr.length; i++) {
            if (data._id == window.componentArr[i]._id) {
                result = (JSObjectValueEqual(window.componentArr[i], data));
                break;
            }
        }
        return result;
    },
    /**
     * 更新组件信息，先componentArr，再DTO
     */
    updateComponentData: function (newData, currentData) {
        var data = newData;
        //更新componentArr里的数据
        for (var i = 0; i < window.componentArr.length; i++) {
            if (data._id == window.componentArr[i]._id) {
                window.componentArr[i] = data;
            }
        }
        //更新DTO里面的数据
        for (var i = 0; i < currentData.editViewConfigs.length; i++) {
            var editViewConfigItem = currentData.editViewConfigs[i];
            var configs = editViewConfigItem.configs;//存放组件配置的属性
            for (var j = 0; j < configs.length; j++) {
                //获取到当个组件信息
                var componentData = configs[j];
                //找出相同id的配置，然后比较其配置是否相同，不比较path
                if (data._id == componentData._id) {
                    var copyComponentData = Ext.clone(componentData);
                    delete copyComponentData.componentPath;
                    delete copyComponentData.configId;
                    if (JSObjectValueEqual(copyComponentData, data)) {

                    } else {
                        configs[j] = Ext.Object.merge(componentData, data);
                    }
                }
            }
        }
        return currentData;
    }
});
