Ext.Loader.syncRequire('CGP.product.edit.model.Attribute');
Ext.define("CGP.product.edit.controller.Controller", {

    data: null,
    page: null,
    controller: {},
    notOptional: ['TextField', 'TextArea', 'Date', 'File', 'Canvas', 'DiyConfig', 'DiyDesign'],
    productInitPanel: null,
    customAttributeId: 0,
    skuAttributePanel: null,
    attributes: null,
    configurableProductId: null,
    generalAttributePanel: null,
    sku: new Ext.data.Store({
        model: 'CGP.product.edit.model.Attribute',
        sorters: [
            {
                direction: 'ASC',
                property: 'sortOrder'
            }
        ]

    }),
    statics: {
        configurableProductId: null
    },
    /**
     * 初始化新建或编辑界面
     * @param {Ext.container.Viewpor} page 新建编辑产品时的显示容器
     * @param {Object} data 产品信息
     */
    initPanel: function (page, data) {
        var me = this;

        me.data = data || new Object();
        me.page = page;
        if (!Ext.Object.isEmpty(me.data)) {
            if (me.data.type) {
                //先下加载好  该产品  主类目的   attribute
                me.attributes = new Ext.data.Store({
                    model: 'CGP.model.Attribute',
                    remoteSort: false,
                    pageSize: 25,
                    proxy: {
                        type: 'uxrest',
                        url: adminPath + 'api/productCategories/' + data.mainCategory.id + '/attribute',
                        reader: {
                            type: 'json',
                            root: 'data'
                        }
                    }
                });
                //data有值，是编辑模式。 进入编辑产品属性  面板
                me.configGeneralAttribute(me.data);
                CGP.product.edit.controller.Controller.configurableProductId = me.data.id
            } else {

            }
        } else {
            //data为空   进入新建产品面板
            me.createInitPanel();
        }
    },
    configGeneralAttribute: function (specData) {
        var me = this;
        //移除所有items
        me.page.removeAll(false);
        var genericAttributeBlock;
        //update 编辑模式
        if (specData) {
            if (specData.type == 'Configurable') {
                me.configurableProductId = specData.id;
                genericAttributeBlock = me.createConfigurableProductGeneralAttributePanel(me.data);
            } else {
                genericAttributeBlock = me.createSkuProductGeneralAttributePanel(me.data);
            }
            genericAttributeBlock.setValue(me.data);

        } else {
            // create 新建模式
            if (me.data.type == 'Configurable') {
                genericAttributeBlock = me.createConfigurableProductGeneralAttributePanel();
            } else {
                genericAttributeBlock = me.createSkuProductGeneralAttributePanel();
                console.log(me.attributes);
            }
        }

        me.page.add(genericAttributeBlock.content);
    },
    /**
     * 选择了产品分类和产品类型
     */
    createInitPanel: function () {
        var me = this;
        var productInitPanel = Ext.create("CGP.product.edit.view.NewProductForm", {
            controller: me
        });
        me.page.add(productInitPanel);
    },
    /**
     * 选择了产品分类和产品类型后点击下一步的跳转函数
     * @param form
     */
    createProductNextStep: function (form) {
        var me = this;
        me.data.type = form.getComponent('productType').getValue();
        me.data.mainCategory = {
            id: form.getComponent('mainCategory').getValue().id
        };
        me.data.websiteId = form.getComponent('website').getValue();
        me.websiteId = form.getComponent('mainCategory').getValue().website;
        //加载   类目下的属性store
        me.attributes = new Ext.data.Store({
            model: 'CGP.model.Attribute',
            remoteSort: false,
            pageSize: 25,
            proxy: {
                type: 'uxrest',
                url: adminPath + 'api/productCategories/' + me.data.mainCategory.id + '/attribute',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }
        });

        me.attributes.load();

        if (me.data.type == 'Configurable') {
            //configurable product 进入skuAttribute配置
            me.configSkuAttribute();
        } else if (me.data.type == 'Sku') {
            var genericBlock = me.createSkuProductGeneralAttributePanel();

            me.page.removeAll();
            me.page.add(genericBlock.content);
        }
    },
    /**
     * 产品编辑tab的属性页面
     * @param {Ext.data.Store} attributeStore 属性store
     * @returns {CGP.product.edit.module.AttributeValue}
     */
    createAttributeValueForm: function (attributeStore) {
        var me = this;
        var attributeBlock = Ext.create('CGP.product.edit.module.AttributeValue', {
            attributes: me.attributes,
            data: me.data
        });
        attributeBlock.setValue(attributeStore);

        return attributeBlock;
    },
    /**
     * 管理可配置产品的sku属性
     */
    configSkuAttribute: function () {
        var me = this;
        //先移除所有的item
        me.page.removeAll(false);

        function skuAttributeChanged() {
            for (var i = 0; i < me.sku.getCount(); i++) {
                me.sku.getAt(i).set('sortOrder', i);
            }
        }

        me.sku.on('datachanged', skuAttributeChanged, me.sku);
        var skuAttributePanel = Ext.create("CGP.product.edit.view.ManagerSkuAttribute", {
            controller: me
        });
        me.page.add(skuAttributePanel);
    },
    /**
     * 可配置产品新建或编辑
     * @param {Object} data 产品信息
     * @returns {{}} 产品编辑页面
     */
    createConfigurableProductGeneralAttributePanel: function (data) {
        var me = this;
        var configurableProductGeneralBlock = {};

        ///template
        var templateBlock = Ext.create('CGP.product.edit.module.Template');

        var infoBlock = Ext.create('CGP.product.edit.module.Information', me.data);
        /*var relatedProductBlock = Ext.create('CGP.product.view.relatedproduct.MainPanel', {
            data: me.data
        });*/

        var mediaBlock = Ext.create('CGP.product.edit.module.Media');

        //如果存在data ?使用data中的?据?生成attributeValue
        var attributeBlock;
        if (data) {

            attributeBlock = me.createAttributeValueForm(data.attributeValues);
        } else {
            attributeBlock = me.createAttributeValueForm(me.attributes);
        }
        //var skuProductPanel = me.createSkuProductPanel();

        configurableProductGeneralBlock.content = Ext.create("CGP.product.edit.view.ConfigurableProductTab", {
            controller: me,
            infoBlock: infoBlock,
            mediaBlock: mediaBlock,
            templateBlock: templateBlock,
            attributeBlock: attributeBlock,
            //relatedProductBlock: relatedProductBlock,
            //skuProductPanel: skuProductPanel,
            data: me.data,
            saveConfigurableProduct: saveConfigurableProduct,
            copyProduct: copyProduct
        });

        function saveConfigurableProduct() {
           ;
            var isValid = true;
            for (var i = 0; i < configurableProductGeneralBlock.content.items.items.length; i++) {
                var item = configurableProductGeneralBlock.content.items.items[i];
                if (item.isValid && !item.isValid()) {
                    isValid = false;
                    configurableProductGeneralBlock.content.setActiveTab(item);
                    break;
                }
            }
            if (isValid == false) {
                return;
            } else {
                configurableProductGeneralBlock.content.el.mask('加载中..');
                configurableProductGeneralBlock.content.updateLayout();
                //template data
                data = data || me.data;
                var template = templateBlock.content.form.getValuesByModel('CGP.model.ProductTemplate');
                data.template = Ext.merge(data.template || {}, template);
                var info = infoBlock.getValue();
                data = Ext.merge(data, info);
                var attributeValues = attributeBlock.getValue();
                data.medias = mediaBlock.getValue();
                data.attributeValues = attributeValues;
                data.customAttributes = [];
                //data.relatedProducts = relatedProductBlock.getValue();
                var product = Ext.create('CGP.model.Product', data);

                //保存?品
                product.save({
                    callback: function (records, operation, success) {
                        configurableProductGeneralBlock.content.el.unmask();
                        if (success) {
                            Ext.Msg.alert('提示', '保存成功!');
                            var responseData = Ext.JSON.decode(operation.response.responseText).data;
                            me.data = responseData;
                            infoBlock.content.getComponent('id').setValue(responseData.id);
                            infoBlock.content.setValue(responseData);
                            me.configurableProductId = responseData.id;
                            CGP.product.edit.controller.Controller.configurableProductId = responseData.id;
                        }
                    }
                });
                console.log(product);
            }
        }

        function copyProduct() {
            data = data || {};
            //复制?品?料 ?行新建
            infoBlock.copy(data);
            infoBlock.content.getComponent('model').setValue("");
            attributeBlock.copy(data);
            mediaBlock.copy(data);
            Ext.Array.each(data.skuAttributes, function (sa) {
                sa.id = null;
            })
        }

        configurableProductGeneralBlock.setValue = function (data) {
            templateBlock.setValue(data.template);
            infoBlock.setValue(data);
            mediaBlock.setValue(data.medias);
        }

        return configurableProductGeneralBlock;
    },
    /**
     * sku新建或编辑界面
     * @param {Object} skuData 产品数据
     * @returns {{}}
     */
    createSkuProductGeneralAttributePanel: function (skuData) {
        var me = this;
        var genericAttributeBlock = {};

        var templateBlock = Ext.create('CGP.product.edit.module.Template');

        var infoBlock = Ext.create('CGP.product.edit.module.Information', me.data);
        /*var relatedProductBlock = Ext.create('CGP.product.view.relatedproduct.MainPanel', {
            data: me.data
        });*/
        var attributeBlock;

        if (!Ext.isEmpty(skuData)) {

            attributeBlock = me.createAttributeValueForm(skuData.attributeValues);
        } else {
            attributeBlock = me.createAttributeValueForm(me.attributes);
        }
        var mediaBlock = Ext.create('CGP.product.edit.module.Media');
        //加入Sku column
        infoBlock.content.insert(0, {
            xtype: 'textfield',
            name: 'CGP.model.Product.sku',
            fieldLabel: 'sku',
            itemId: 'sku',
            allowBlank: false
        });

        genericAttributeBlock.content = Ext.create("CGP.product.edit.view.SkuProductTab", {
            controller: me,
            infoBlock: infoBlock,
            mediaBlock: mediaBlock,
            templateBlock: templateBlock,
            attributeBlock: attributeBlock,
            //relatedProductBlock: relatedProductBlock,
            data: me.data,
            skuData: skuData
        });

        genericAttributeBlock.setValue = function (data) {
            data = Ext.merge(data, {
                type: 'sku'
            });
            data.template && templateBlock.setValue(data.template);
            infoBlock.setValue(data);
            data.medias && mediaBlock.setValue(data.medias);
        }
        return genericAttributeBlock;
    },
    /**
     * 创建可配置产品编辑界面的sku产品组件
     * @returns {{}}
     */
    createSkuProductPanel: function () {
        var me = this;
        var block = {};
        var skuProducts = [];
        var skuProductStore;
        //sku属性的id
        var skuAttributeIds = [];
        //已经存在的sku 类型
        var existTypes = [];

        //sku attribute已被使用的option（选项）
        function createSkuAttributeForm(container, attributes) {
            var skuAttributeForm = Ext.create("CGP.product.edit.component.skuproducts.SkuAttribute", {
                configurableProductId: me.configurableProductId,
                skuAttributes: me.data.skuAttributes,
                attributes: attributes,
                skuProductContainer: container,
                createSkuProductGrid: createSkuProductGrid

            });
            container.add(skuAttributeForm);

        }

        //新建sku展示和新建SkuProduct的panel
        function createSkuProductGrid(skuProducts, skuAttributeIds, container, attributes, existTypes) {
            /**
             *增加已有skuProduct到ConfigurableProduct中
             *
             */
            function addSkuProductToconfigurableProduct() {
                var grid = this.ownerCt.ownerCt;
                var records = grid.getSelectionModel().getSelection();
                var skuProductIds = [];
                Ext.Array.each(records, function (record) {
                    skuProductIds.push(record.get('id'));
                });
                if (Ext.isEmpty(skuProductIds)) {
                    Ext.Msg.alert('提示', '请选择SKU产品!');
                } else {
                    Ext.Ajax.request({
                        method: 'PUT',
                        url: adminPath + 'api/products/configurable/' + me.configurableProductId + '/skuProduct?' +
                            'access_token=' +
                            Ext.util.Cookies.get('token') + '&' + Ext.urlEncode({
                                skuProductIds: skuProductIds
                            }),
                        callback: function (options, success, response) {
                            if (success) {
                                var resp = Ext.JSON.decode(response.responseText);
                                if (resp.success) {
                                    skuProductStore.loadData(resp.data, true);
                                    grid.getStore().load();
                                    Ext.Msg.alert('Info', 'Add sku product success!');

                                } else {
                                    Ext.Msg.alert('Info', 'Add faild,' + resp.data.message);
                                }
                            } else {
                                var resp = Ext.JSON.decode(response.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                            }
                        }

                    });
                }
            }

            var skuProductStore = new Ext.data.Store({
                model: 'CGP.model.Product',
                proxy: {
                    type: 'memory'
                },
                data: skuProducts,
                autoLoad: true
            })
            /**
             *可配置产品sku产品界面grid组件
             * @type {CGP.product.edit.component.skuproducts.SkuProductGrid}
             */
            var skuProductGrid = Ext.create("CGP.product.edit.component.skuproducts.SkuProductGrid", {
                controller: me,
                attributes: attributes,
                existTypes: existTypes,
                skuAttributeIds: skuAttributeIds,
                store: skuProductStore,
                simpleCreate: simpleCreate,
                batchCreate: batchCreate,
                addFromExist: addFromExist
            });

            /**
             * 点击简单创建sku产品时触发函数，生成简单创建窗口
             */
            function simpleCreate() {
                var skuData = me.data;

                skuData.configurableProductId = me.configurableProductId;
                skuData.id = null;
                skuData.attributeValues = skuData.skuAttributes;

                var skuProductGeneralAttributeBlock = me.createSkuProductGeneralAttributePanel(skuData);
                skuProductGeneralAttributeBlock.setValue(skuData);
                Ext.create("CGP.product.edit.component.skuproducts.SimpleCreateWin", {
                    skuProductGeneralAttributeBlock: skuProductGeneralAttributeBlock.content
                }).show();
            }

            /**
             * 批量创建sku产品窗口,生成窗口实现操作
             */
            function batchCreate() {
                Ext.create("CGP.product.edit.component.skuproducts.BatchCreateWin", {
                    skuProductStore: skuProductStore,
                    data: me.data,
                    sku: me.sku,
                    attributes: attributes,
                    existTypes: existTypes,
                    skuAttributeIds: skuAttributeIds,
                    configurableProductId: me.configurableProductId
                }).show();
            }

            /**
             * 从已有中添加触发的函数
             */
            function addFromExist() {
                Ext.create("CGP.product.edit.component.skuproducts.AddFromExistWin", {
                    sku: me.sku,
                    attributes: attributes,
                    skuAttributeIds: skuAttributeIds,
                    configurableProductId: me.configurableProductId,
                    addSkuProductToconfigurableProduct: addSkuProductToconfigurableProduct
                }).show();
            }

            container.add(skuProductGrid);
        }

        block.content = Ext.create("CGP.product.edit.component.skuproducts.SkuProductPanel", {
            createSkuAttributeForm: createSkuAttributeForm,
            configurableProductId: me.configurableProductId,
            sku: me.sku,
            attributes: me.attributes
        })


        return block;
    },
    /**
     * 修改可配置產品管关联的sku产品
     * @param view
     * @param rowIndex
     * @param colIndex
     * @param item
     * @param e
     * @param record
     * @param row
     */
    updateSkuProduct: function (view, rowIndex, colIndex, item, e, record, row) {

        var window = Ext.create("CGP.product.edit.component.skuproducts.UpdateSkuProductWin", {
                confirmUpdate: confirmUpdate
            }
        );

        function confirmUpdate(window) {
            var form = window.down('form');
            form.updateRecord();
            var record = form.getRecord();
            var data = record.getData();
            var lm = window.setLoading(true);
            Ext.Ajax.request({
                url: adminPath + 'api/products/sku/' + data.id + '/baseInfo',
                method: "PUT",
                jsonData: data,
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                success: function (resp, option) {
                    lm.hide();
                    var r = Ext.JSON.decode(resp.responseText);
                    if (!r.success) {
                        Ext.Msg.alert('提示', r.data.message);
                        return;
                    }
                    record.commit();
                    window.close();
                },
                failure: function (resp, option) {
                    lm.hide();
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            });
        }

        var form = window.down('form');
        form.loadRecord(record);
        window.show();

    },
    /**
     * 删除可配置产品关联的sku产品
     * @param view
     * @param rowIndex
     * @param colIndex
     * @param item
     * @param e
     * @param record
     * @param row
     */
    removeSkuProduct: function (view, rowIndex, colIndex, item, e, record, row) {
        Ext.MessageBox.confirm("提示", "是否刪除？", function (btn) {
            if (btn == 'yes') {
                //?送?求移除?系
                Ext.Ajax.request({
                    method: 'DELETE',
                    url: adminPath + 'api/products/list/' + record.get('id') + '?access_token=' +
                        Ext.util.Cookies.get('token'),
                    success: function (response, options) {
                        var resp = Ext.JSON.decode(response.responseText);
                        if (resp.success) {
                            Ext.Msg.alert('Info', 'Remove sku product success!');
                            //服?器完成移除后，本地?Store中?除
                            var store = view.getStore();
                            store.remove(record);
                        } else {
                            Ext.Msg.alert('Info', 'Remove Faild,' + resp.data.message)
                        }

                    },
                    failure: function (resp, options) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                });
            }
        });


    },
    /**
     * 可配置产品编辑时关联的sku产品在渲染前所触发的函数取得新建后的configurableProductId
     */
    beforeRenderSkuPanel: function () {
        var me = this;
        return me.configurableProductId;
    }
})
