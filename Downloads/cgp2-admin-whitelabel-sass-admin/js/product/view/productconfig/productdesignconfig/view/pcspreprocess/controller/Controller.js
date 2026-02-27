Ext.define('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.controller.Controller', {
    saveRecord: function (data, PMVTId, store, tipInfo, form, jsonEdit) {
        var controller = this;
        var url = adminPath + 'api/pagecontentschemapreprocessconfig/' + PMVTId + '/placeholders';
        if (form.createOrEdit == 'edit') {
            url += '/' + data._id;
        } else {
            if (data._id) {

            } else {
                data._id = JSGetCommonKey();
            }
        }
        Ext.Ajax.request({
            url: url,
            method: form.createOrEdit == 'edit' ? 'PUT' : 'POST',
            jsonData: data,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey(tipInfo));
                    if (store) {
                        store.loadPage(store.currentPage);
                    }
                    if (form) {
                        form.createOrEdit = 'edit';
                        form.recordId = responseMessage.data._id;
                        var title = form.title;
                        title = title.replace('新建', '编辑');
                        form.setTitle(title);
                        form.setValue(responseMessage.data);
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
    deleteRecord: function (store, record, PMVTId, mask) {
        Ext.Ajax.request({
            url: adminPath + 'api/pagecontentschemapreprocessconfig/' + PMVTId + '/placeholders/' + record.getId(),
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    mask.hide();
                    Ext.Msg.alert(i18n.getKey('prompt'), '删除成功！');
                    store.loadPage(store.currentPage);
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    mask.hide();
                }
            },
            failure: function (response) {
                mask.hide();
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
    },
    addProductMaterialViewTypeWin: function (record, productConfigDesignId, productId) {
        var me = this;
        var recordId = record ? record.getId() : null;
        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');//最外面的tabs
        builderConfigTab.editProductMaterialViewType(recordId, productId, productConfigDesignId, productBomConfigId, schemaVersion);
    },
    editOperator: function (graphData, form, test) {
        form.aaa = 'test';
        graphData = JSON.parse(graphData);
        if (Ext.Object.isEmpty(graphData)) {
            graphData = {};
        }
        Ext.create('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.EditPreprocessWindow', {
            graphData: graphData,
            form: form,
            test: test
        }).show();
    },
    editPcsPreprocess: function (recordId, productId, PMVTId, outTab) {
        var controller = this;
        var title = (recordId ? i18n.getKey('edit') : i18n.getKey('create')) + i18n.getKey('pcs') + i18n.getKey('preprocess');
        var pcsPreprocessView = outTab.getComponent('pcsPreprocessView');
        outTab.remove(pcsPreprocessView);
        pcsPreprocessView = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.EditCommonPCSForm', {
            PMVTId: PMVTId,
            recordId: recordId,
            itemId: 'pcsPreprocessView',
        });
        outTab.add(pcsPreprocessView);
        pcsPreprocessView.setTitle(title);
        outTab.setActiveTab(pcsPreprocessView);

    },
    /**
     * 编辑新建网格布局的预处理
     * @param recordId
     * @param productId
     * @param PMVTId
     * @param outTab
     */
    editGridPcsPreprocess: function (recordId, productId, PMVTId, outTab) {
        var controller = this;
        var title = '';
        if (recordId) {
            title = i18n.getKey('edit') + i18n.getKey('grid') + i18n.getKey('pcs') + i18n.getKey('preprocess') + '(' + recordId + ')';
        } else {
            title = i18n.getKey('create') + i18n.getKey('grid') + i18n.getKey('pcs') + i18n.getKey('preprocess');
        }
        var pcsPreprocessView = outTab.getComponent('gridPCSPreprocessView');
        outTab.remove(pcsPreprocessView);
        pcsPreprocessView = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.EditGridPCSPreProcessForm', {
            PMVTId: PMVTId,
            recordId: recordId,
            contentData: outTab.contentData,
            itemId: 'gridPCSPreprocessView',
        });
        outTab.add(pcsPreprocessView);
        pcsPreprocessView.setTitle(title);
        outTab.setActiveTab(pcsPreprocessView);
    },
    /**
     * 编辑PCSGridTempaltePreprocessItem
     */
    editGridPCSTemplateItem: function (outTab, record, PMVTId, pcsConfigData) {
        var controller = this;
        var title = (record ? i18n.getKey('edit') : i18n.getKey('create')) + i18n.getKey('preprocessItem');
        var gridPCSTemplateItem = outTab.getComponent('gridPCSTemplateItem');
        outTab.remove(gridPCSTemplateItem);
        gridPCSTemplateItem = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.gridpcstemplateitem.view.OutTab', {
            PMVTId: PMVTId,
            record: record,
            pcsConfigData: pcsConfigData,
            contentData: outTab.contentData,
            itemId: 'gridPCSTemplateItem',
        });
        outTab.add(gridPCSTemplateItem);
        gridPCSTemplateItem.setTitle(title);
        outTab.setActiveTab(gridPCSTemplateItem);
    },
    /**
     *通过pmvtId获取到pcs数据
     */
    getPCSData: function (pmvtId) {
        var result = null;
        var url = adminPath + 'api/pagecontentpreprocess/' + pmvtId + '/pageContentSchema';
        JSAjaxRequest(url, 'GET', false, null, null, function (request, successs, response) {
            if (successs) {
                var responseText = Ext.JSON.decode(response.responseText);
                result = responseText.data;
            }
        })
        return result;
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
        return contentData;
    },
    /**
     * 根据输入的模板数据自动生成完整的Gird预处理程序
     */
    builderGameTileData: function (data) {
        var displayData = data.display;
        var designData = data.design;
        var result = {
            condition: data.condition,
            index: data.index,
            description: data.description,
            conditionDTO: data.conditionDTO,
            itemQty: data.itemQty,
            layout: data.layout,
            itemSize: data.itemSize,
            clazz: 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.PCSGridTemplatePreprocessCommonConfig',
            preprocessItems: [
                {
                    //显示页
                    conditionDTO: {
                        clazz: "com.qpp.cgp.domain.executecondition.InputCondition",
                        conditionType: "custom",
                        operation: {
                            clazz: "com.qpp.cgp.domain.executecondition.operation.CustomExpressionOperation",
                            expression: "function expression(args){return true;}",
                            multilingualKey: "com.qpp.cgp.domain.executecondition.operation.CustomExpressionOperation",
                            operations: []
                        }
                    },
                    condition: {
                        clazz: "com.qpp.cgp.value.ExpressionValueEx",
                        constraints: [],
                        expression: {
                            clazz: "com.qpp.cgp.expression.Expression",
                            expressionEngine: "JavaScript",
                            expression: "function expression(args){return true;}",
                            inputs: [],
                            resultType: "Boolean",
                        },
                        type: "Boolean"
                    },
                    description: "显示層预处理",
                    selector: "$.layers[1].items",
                    itemTemplate: {
                        "x": 0,
                        "y": 0,
                        "width": data.itemSize.width,
                        "height": data.itemSize.height,
                        "rotation": 0,
                        "clazz": "Container",
                        "items": [
                            {
                                "clazz": "Text",
                                "x": data.display.text.x,
                                "y": data.display.text.y,
                                "width": data.display.text.width,
                                "height": data.display.text.height,
                                "text": "Tile 1",
                                "style": {
                                    "fontFamily": "Arial",
                                    "color": 5519401,
                                    "fontSize": "10",
                                    "fontStyle": "normal",
                                    "weight": "normal"
                                }
                            },
                            {
                                "clazz": "Image",
                                "x": 0,
                                "y": (data.display.text.y + data.display.text.height),
                                "width": data.itemSize.width,
                                "height": data.itemSize.height - (data.display.text.height + data.display.text.y),
                                "imageName": data.display.image.imageName,
                                "imageWidth": data.itemSize.width,
                                "imageHeight": data.itemSize.height - (data.display.text.height + data.display.text.y)
                            }
                        ]
                    },
                    canvas: null,
                    itemProcesses: [{
                        fieldName: null,
                        fieldValue: data.display.jsonFilter.value,//function expression(input){return 'Tile'+(input.context['TimeIndex']+1)}",
                        operator: "update",
                        selector: data.display.jsonFilter.selector,
                        sortOrder: 1,
                    }]
                },
                {
                    //定制页
                    conditionDTO: {
                        "clazz": "com.qpp.cgp.domain.executecondition.InputCondition",
                        "conditionType": "custom",
                        "operation": {
                            "operations": [],
                            "clazz": "com.qpp.cgp.domain.executecondition.operation.CustomExpressionOperation",
                            "expression": "function expression(args){return true;}"
                        }
                    },
                    condition: {
                        "clazz": "com.qpp.cgp.value.ExpressionValueEx",
                        "constraints": [],
                        "expression": {
                            "clazz": "com.qpp.cgp.expression.Expression",
                            "expression": "function expression(args){return true;}",
                            "expressionEngine": "JavaScript",
                            "resultType": "Boolean"
                        },
                        "type": "Boolean"
                    },
                    description: "定制层预处理",
                    selector: "$.layers[0].items",
                    itemTemplate: {
                        clazz: "Container",
                        readOnly: false,
                        tags: [],
                        x: 0,
                        y: 0,
                        width: data.itemSize.width,
                        height: data.itemSize.height,
                        rotation: 0,
                        scale: 1,
                        items: [{
                            "clazz": "Container",
                            "readOnly": false,
                            "tags": [],
                            "x": data.design.innerContainer.x + data.design.innerContainer.padding.top,
                            "y": data.design.innerContainer.y + data.design.innerContainer.padding.left,
                            "width": data.itemSize.width - data.design.innerContainer.x - data.design.innerContainer.padding.top - data.design.innerContainer.padding.bottom,
                            "height": data.itemSize.height - data.design.innerContainer.y - data.design.innerContainer.padding.left - data.design.innerContainer.padding.right,
                            "scale": 1,
                            "clipPath": data.design.innerContainer.clipPath ? {
                                "clazz": "Path",
                                "d": data.design.innerContainer.clipPath.d,
                                "visible": true
                            } : null,
                            "items": [{
                                "clazz": "Picture",
                                "readOnly": false,
                                "tags": [],
                                "x": 0,
                                "y": 0,
                                "width": data.itemSize.width - data.design.innerContainer.x - data.design.innerContainer.padding.top - data.design.innerContainer.padding.bottom,
                                "height": data.itemSize.height - data.design.innerContainer.y - data.design.innerContainer.padding.left - data.design.innerContainer.padding.right,
                                "scale": 1,
                                "printFile": "",
                                "imageName": data.design.innerContainer.imageName
                            }]
                        }]
                    },
                    canvas: {
                        "selector": {
                            "clazz": "com.qpp.cgp.value.ExpressionValueEx",
                            "type": "Array",
                            "constraints": [],
                            "expression": {
                                "clazz": "com.qpp.cgp.expression.Expression",
                                "resultType": "Array",
                                "expressionEngine": "JavaScript",
                                "inputs": [],
                                "expression": "function expression(input){" +
                                    "var itemQty= input.context.itemQty;" +
                                    "var titleArray = [];" +
                                    "for(var i = 0;i < itemQty;i++){" +
                                    "titleArray.push('$.layers[0].items['+i+'].items[0]')" +
                                    "}" +
                                    "return titleArray}",
                                "multilingualKey": "com.qpp.cgp.expression.Expression"
                            }
                        },
                        "operationType": "Replace",
                        "canvas": {
                            '_id': '133829',
                            "clazz": "Canvas",
                            "description": "GameTile通用约束",
                            "containPath": {
                                "clazz": "SelectorCanvasContainerPath",
                                "selector": "$.layers[0].items[0].items[0]"
                            },
                            "constraints": [
                                {
                                    "clazz": "CanvasConstraint",
                                    "elements": [{
                                        "priority": 1,
                                        "filter": {
                                            "clazz": "ClassCanvasElementFilter",
                                            "isInclude": true,
                                            "className": "Picture"
                                        },
                                        "clazz": "CanvasConstraintElement"
                                    }],
                                    "rules": [{
                                        "clazz": "ElementActionConstraintRule",
                                        "value": {
                                            "rtType": {
                                                "clazz": "com.qpp.cgp.domain.bom.attribute.RtType",
                                                "_id": "10591343"
                                            },
                                            "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                                            "objectJSON": {"enable": true, "clazz": "EnableRtType"}
                                        },
                                        "key": "ENABLE$EDIT"
                                    }]
                                },
                                {
                                    "clazz": "CanvasConstraint",
                                    "elements": [{
                                        "priority": 2,
                                        "filter": {
                                            "clazz": "ClassCanvasElementFilter",
                                            "isInclude": true,
                                            "className": "MultiLineText"
                                        },
                                        "clazz": "CanvasConstraintElement"
                                    }],
                                    "rules": [{
                                        "clazz": "ElementActionConstraintRule",
                                        "value": {
                                            "rtType": {
                                                "clazz": "com.qpp.cgp.domain.bom.attribute.RtType",
                                                "_id": "10591343"
                                            },
                                            "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                                            "objectJSON": {"enable": true, "clazz": "EnableRtType"}
                                        },
                                        "key": "ENABLE$EDIT"
                                    }, {
                                        "clazz": "ContinuousItemQtyConstraintRule",
                                        "maxValue": null,
                                        "minValue": 0,
                                        "isEqualToMax": null,
                                        "isEqualToMin": true
                                    }, {
                                        "clazz": "ElementActionConstraintRule",
                                        "value": {
                                            "rtType": {
                                                "clazz": "com.qpp.cgp.domain.bom.attribute.RtType",
                                                "_id": "10591343"
                                            },
                                            "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                                            "objectJSON": {"enable": true, "clazz": "EnableRtType"}
                                        },
                                        "key": "ENABLE$DELETE"
                                    }, {
                                        "clazz": "ElementActionConstraintRule",
                                        "value": {
                                            "rtType": {
                                                "clazz": "com.qpp.cgp.domain.bom.attribute.RtType",
                                                "_id": "10591343"
                                            },
                                            "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                                            "objectJSON": {"enable": true, "clazz": "EnableRtType"}
                                        },
                                        "key": "ENABLE$TRANSFORM"
                                    }, {
                                        "clazz": "ElementActionConstraintRule",
                                        "value": {
                                            "rtType": {
                                                "clazz": "com.qpp.cgp.domain.bom.attribute.RtType",
                                                "_id": "10591343"
                                            },
                                            "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                                            "objectJSON": {"enable": true, "clazz": "EnableRtType"}
                                        },
                                        "key": "ENABLE$DRAG"
                                    },
                                        data.design.moveAreaConstraintRule
                                    ]
                                }
                            ]
                        }
                    },
                    "itemProcesses": []
                }],
        };
        console.log(result);
        return result;
    }
})
