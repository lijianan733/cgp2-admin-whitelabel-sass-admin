Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.controller.Controller', {
    PMVTTContentData: null,
    /**
     * 创建DOT对应的domain
     * @param data
     */
    buildDomain: function (data) {
        var domain = {
            _id: data.builderViewConfigDomain ? data.builderViewConfigDomain._id : JSGetCommonKey(false),
            clazz: 'com.qpp.cgp.domain.product.config.view.builder.config.OrdinaryBuilderViewConfig',
            description: null,
            editViewConfigs: null,
            productConfigViewId: data.productConfigViewId,
        };
        var editViewConfigs = [];
        for (var i = 0; i < data.editViewConfigs.length; i++) {
            var editViewConfig = data.editViewConfigs[i];
            var configs = [];
            for (var j = 0; j < editViewConfig.configs.length; j++) {
                var config = editViewConfig.configs[j];
                var localData = Ext.clone(config);
                delete localData._id;
                //特殊处理。一下几种类型的数据用另一种clazz结构
                /*   H1 ： $.areas[?(@.position.layoutPosition=='H1')].components[0]
                   H3 ： $.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='H3')]
                   ToolTips ： $.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='ToolTips')]
                   ToolBar ： $.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='ToolBar')]
                   AssistBar ： $.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='AssistBar')]
                   DocumentView ： $.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='DocumentView')]
                   */

                if (localData.componentPath.clazz == 'com.qpp.cgp.domain.product.config.view.builder.config.NamePath') {

                } else {
                    var FullPath = {
                        "$.areas[?(@.position.layoutPosition=='H1')].components[?(@.name=='H1')]": "$.areas[?(@.position.layoutPosition=='H1')].components[0]",//这个配置是为了处理配置人员已经配置了的大量不兼容数据
                        "$.areas[?(@.position.layoutPosition=='H1')].components[?(@.name=='H1NavBar')]": "$.areas[?(@.position.layoutPosition=='H1')].components[0]",
                        "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='H3')]": "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='H3')]",
                        "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='H4')]": "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='H4')]",
                        "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='ToolTips')]": "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='ToolTips')]",
                        "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='ToolBar')]": "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='ToolBar')]",
                        "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='AssistBar')]": "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='AssistBar')]",
                        "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='DocumentView')]": "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='DocumentView')]"
                    };
                    if (FullPath[localData.componentPath.path]) {
                        //以上6种使用fullPath
                        localData.componentPath.path = FullPath[localData.componentPath.path];

                    } else {
                        //其余情况使用namePath,把fullPath转成namePath
                        var newPath = localData.componentPath.path.split("[?(@.name=='")[0];
                        var newName = localData.componentPath.path.split("[?(@.name=='")[1];
                        newName = newName.split("')]")[0];
                        var namePath = {
                            clazz: 'com.qpp.cgp.domain.product.config.view.builder.config.NamePath',
                            name: newName,
                            path: newPath
                        }
                        localData.componentPath = namePath;
                    }
                }
                localData = Ext.Object.merge(localData, {
                    navItemId: editViewConfig.navItemId
                });
                configs.push(localData);
            }
            editViewConfigs.push({
                editViewType: editViewConfig.editViewType.editViewTypeDomain,
                builderView: {
                    clazz: 'com.qpp.cgp.domain.product.config.view.builder.config.OrdinaryBuilderViewConfig',
                    _id: domain._id,
                },
                configs: configs
            })
        }
        //现在要把同一editViewType的组件配置分为一组
        var newEditViewConfigs = {};
        for (var i = 0; i < editViewConfigs.length; i++) {
            var editViewTypeId = editViewConfigs[i].editViewType._id;
            if (Ext.isEmpty(newEditViewConfigs[editViewTypeId])) {
                newEditViewConfigs[editViewTypeId] = {
                    builderView: editViewConfigs[i].builderView,
                    configs: [],
                    editViewType: editViewConfigs[i].editViewType,
                    id: null
                }
            }
            newEditViewConfigs[editViewTypeId].configs = newEditViewConfigs[editViewTypeId].configs.concat(editViewConfigs[i].configs);
        }
        domain.editViewConfigs = Object.values(newEditViewConfigs);
        return domain;
    },
    /**
     * 把自定义的JSON数据转换出对应的DTO界面配置数据
     */
    domainToDTO: function (JSONData, DTO) {
        var controller = this;
        var DTOData = {
            builderViewConfigDomain: JSONData,
            clazz: "com.qpp.cgp.domain.product.config.view.builder.dto.OrdinaryBuilderViewConfigDto",
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

                    if (config.componentPath.clazz == 'com.qpp.cgp.domain.product.config.view.builder.config.NamePath') {

                    } else {
                        var FullPath = {
                            "$.areas[?(@.position.layoutPosition=='H1')].components[0]": "$.areas[?(@.position.layoutPosition=='H1')].components[?(@.name=='H1')]",//这个配置是为了处理配置人员已经配置了的大量不兼容数据
                            "$.areas[?(@.position.layoutPosition=='H1')].components[0]": "$.areas[?(@.position.layoutPosition=='H1')].components[?(@.name=='H1NavBar')]",
                            "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='H3')]": "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='H3')]",
                            "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='H4')]": "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='H4')]",
                            "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='ToolTips')]": "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='ToolTips')]",
                            "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='ToolBar')]": "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='ToolBar')]",
                            "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='AssistBar')]": "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='AssistBar')]",
                            "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='DocumentView')]": "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='DocumentView')]"
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
        var url = adminPath + 'api/editViewTypeDtos?page=1&start=0&limit=25&filter=' + Ext.JSON.encode([{
            name: 'editViewTypeDomain._id',
            type: 'string',
            value: domainId
        }]);
        var result = JSAjaxRequest(url, 'GET', false, null, null);
        /* if (result[0]) {
             result = {
                 clazz: "com.qpp.cgp.domain.product.config.view.builder.dto.EditViewTypeDto",
                 description: result[0].description,
                 editViewTypeDomain: {
                     _id: result[0].editViewTypeDomain._id,
                     clazz: "com.qpp.cgp.domain.product.config.view.builder.config.EditViewType",
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
        var url = adminPath + 'api/builderViewConfigDtos?page=1&start=0&limit=25&filter=' + Ext.JSON.encode([{
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
    saveBuilderViewConfigDTO: function (panel, data) {
        var result = true;
        var controller = this;
        controller.setIdValue(data);//为组件设置id
        data.builderViewConfigDomain = controller.buildDomain(data);
        controller.setIdValue(data);//为domain中的viewConfig设置id
        console.log(data);
        var method = 'POST';
        panel.el.mask();
        panel.updateLayout();
        var url = adminPath + 'api/builderViewConfigDtos';
        if (panel.createOrEdit == 'edit') {
            method = 'PUT';
            data._id = panel.recordData._id;
            url = adminPath + 'api/builderViewConfigDtos/' + panel.recordData._id;
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
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                        panel.recordData = responseMessage.data;
                        panel.items.items[0].recordData = panel.recordData;
                        panel.createOrEdit = 'edit';
                    });
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
            var url = encodeURI(adminPath + 'api/builderViewConfigs?page=1&limit=23&filter=' + Ext.JSON.encode(filter));
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
                                "clazz": "com.qpp.cgp.domain.product.config.view.builder.config.OrdinaryBuilderViewConfig",
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
            var url = adminPath + 'api/builderViewConfigDtos';
            if (DTODate._id) {
                method = 'PUT';
                url = adminPath + 'api/builderViewConfigDtos/' + DTODate._id;
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
                            var DTOData = controller.domainToDTO(JSONData, controller.getBuilderViewConfigDTO(productViewConfigId));
                            saveViewConfigByJSON(JSONData, DTOData, win);
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
    }
});
