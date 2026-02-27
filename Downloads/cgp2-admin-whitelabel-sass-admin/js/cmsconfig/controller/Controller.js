/**
 * @Description:
 * @author nan
 * @date 2022/4/28
 */
Ext.define('CGP.cmsconfig.controller.Controller', {
    /**
     * 保存CMSConfig
     */
    saveCMSConfig: function (tab, data) {
        var url = adminPath + 'api/cms-configs';
        var method = 'POST';
        if (data._id) {
            method = 'PUT';
            url += '/' + data._id;
        }
        JSAjaxRequest(url, method, true, data, null, function (require, success, response) {
            var responseText = Ext.JSON.decode(response.responseText);
            if (success && responseText.success) {
                var newData = responseText.data;
                console.log(newData);
                //修改产品的排序优先级时提示需要重新发布类目
                if (method == 'PUT' && newData.clazz == 'com.qpp.cgp.domain.cms.ProductDetailCMSConfig') {
                    if (newData.globalPriority != 0 && tab.data.globalPriority != newData.globalPriority) {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('保存成功!<br>修改产品的优先级后,需要发布该产品的所有关联类目。'))
                    }
                }
                tab.data = newData;
                tab.setValue(newData);
                top.Ext.getCmp('')
            }
        }, true);
    },

    getQuery: function (url, otherConfig) {
        var data = [];

        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        }, false, otherConfig);
        return data;
    },

    createSelProductImageWin: function (isGroup, store, callBack) {
        var controller = this;
        console.log(store);
        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('选择产品图'),
            width: 700,
            height: 500,
            items: [
                {
                    xtype: 'searchcontainer',
                    name: 'searchcontainer',
                    itemId: 'searchcontainer',
                    filterCfg: {
                        hidden: true,
                    },
                    gridCfg: {
                        editAction: false,
                        deleteAction: false,
                        pagingBar: false,
                        selModel: {
                            selType: 'rowmodel',
                            mode: 'SINGLE'
                        },
                        store: store,
                        features: isGroup ? [
                            {
                                ftype: 'grouping',
                                groupByText: '用本字段分组',
                                showGroupsText: '显示分组',
                                groupHeaderTpl: `{name}`,
                                startCollapsed: true
                            }
                        ] : [],
                        columnDefaults: {
                            tdCls: 'vertical-middle',
                            align: 'center',
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip ="' + value + '"';
                                return value
                            }
                        },
                        tbar: {
                            hidden: true,
                            items: [
                                {
                                    text: i18n.getKey('add'),
                                    iconCls: 'icon_add',
                                    handler: function (btn) {

                                    }
                                },
                                {
                                    text: i18n.getKey('delete'),
                                    iconCls: 'icon_delete',
                                    handler: function (btn) {

                                    }
                                }
                            ]
                        },
                        columns: [
                            {
                                text: i18n.getKey('image'),
                                dataIndex: 'title',
                                flex: 1,
                                renderer: function (value, metadata, record) {
                                    var result = [];
                                    result.push(
                                        {
                                            title: i18n.getKey('标题'),
                                            value: record.get('title')
                                        },
                                        {
                                            title: i18n.getKey('图片提示信息'),
                                            value: record.get('alt')
                                        }
                                    );

                                    return JSCreateHTMLTable(result, 'left');
                                }
                            },
                            {
                                xtype: 'imagecolumn',
                                tdCls: 'vertical-middle',
                                width: 150,
                                dataIndex: 'small',
                                text: i18n.getKey('小图'),
                                buildUrl: function (value, metadata, record) {
                                    if (value) {
                                        var imageUrl = value.name;
                                        var src = imageServer + imageUrl;
                                        return src;
                                    }
                                },
                                buildPreUrl: function (value, metadata, record) {
                                    if (value) {
                                        var imageUrl = value.name;
                                        var src = imageServer + imageUrl;
                                        return src;
                                    }
                                },
                                buildTitle: function (value, metadata, record) {
                                    if (value) {
                                        var imageUrl = value.name;
                                        return `${i18n.getKey('check')} < ${imageUrl} > 预览图`;
                                    }
                                }
                            },
                            {
                                xtype: 'imagecolumn',
                                tdCls: 'vertical-middle',
                                width: 150,
                                dataIndex: 'large',
                                text: i18n.getKey('大图'),
                                buildUrl: function (value, metadata, record) {
                                    if (value) {
                                        var imageUrl = value.name;
                                        var src = imageServer + imageUrl;
                                        return src;
                                    }
                                },
                                buildPreUrl: function (value, metadata, record) {
                                    if (value) {
                                        var imageUrl = value.name;
                                        var src = imageServer + imageUrl;
                                        return src;
                                    }
                                },
                                buildTitle: function (value, metadata, record) {
                                    if (value) {
                                        var imageUrl = value.name;
                                        return `${i18n.getKey('check')} < ${imageUrl} > 预览图`;
                                    }
                                }
                            },
                        ]
                    }
                }
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            searchcontainer = win.getComponent('searchcontainer'),
                            selected = searchcontainer.grid.getSelectionModel().getSelection()

                        if (selected?.length) {
                            callBack && callBack(selected[0]);
                            win.close();
                        } else {
                            Ext.Msg.alert('提示', '请至少选择一条数据!')
                        }
                    }
                }
            },
        }).show();
    },

    getCmsConfigsProductImage: function (productId) {
        if (productId) {
            var controller = this,
                url = adminPath + 'api/cms-configs?page=1&limit=25&filter=' + Ext.JSON.encode([
                    {"name": "product._id", "value": productId, "type": "number"},
                    {"name": "clazz", "value": "com.qpp.cgp.domain.cms.ProductDetailCMSConfig", "type": "string"}
                ]),
                queryData = controller.getQuery(url),
                result = [];

            queryData.forEach(item => {
                var {productImages, _id, pageTitle} = item,
                    newProductImages = productImages.map(item2 => {
                        return Ext.Object.merge(item2, {
                            _id,
                            pageTitle,
                        })
                    })
                result = Ext.Array.merge(result, newProductImages);
            })

            return result;
        }
    },

    getAttributeProfileData: function (productId, attributeVersionId, publishProfileId) {
        var controller = this,
            filterParams = [
                {"name": "productId", "value": productId, "type": "number"},
                {"name": "_id", "value": publishProfileId, "type": "string"},
            ];
        
        if (attributeVersionId){
            filterParams.push(
                {"name": "versionedAttribute._id", "value": attributeVersionId, "type": "number"},
            )
        }

        var url = adminPath + 'api/attributeProfile?page=1&limit=25&filter=' + Ext.JSON.encode(filterParams),
            queryData = controller.getQuery(url),
            result = [];

        if (queryData?.length) {
            var group = queryData[0]['groups'];

            result = group.map(item => {
                return item
            })
        }

        return result
    },

    getStoreDataArr: function (arr) {
        var result = arr?.map(item => {
            return {
                value: item,
                display: item
            }
        })

        return result;
    },

    getFilterOptionsArr: function (data, needFilterId) {
        var result = [];

        data.forEach(item => {
            if (!needFilterId.includes(item['id'])) {
                result.push(item)
            }
        })

        return result;
    },

    getFilteredValues: function (filters, data) {
        return data.filter(item => {
            return filters.every(filter => {
                const {name, value, type, operator = 'exactMatch'} = filter;

                // 获取嵌套属性值
                const props = name.split('.');
                let current = item;
                for (const prop of props) {
                    if (!current || typeof current !== 'object') return false;
                    current = current[prop];
                    if (current === undefined) return false;
                }

                // 类型检查
                if (type && typeof current !== type) return false;

                // 处理模糊查询语法
                if (typeof value === 'string' && value.startsWith('%') && value.endsWith('%')) {
                    const searchText = value.slice(1, -1);
                    return String(current).includes(searchText);
                }

                // 值匹配逻辑
                switch (operator) {
                    case 'exactMatch':
                        return current === value;
                    case 'contains':
                        return String(current).includes(String(value));
                    case 'startsWith':
                        return String(current).startsWith(String(value));
                    case 'endsWith':
                        return String(current).endsWith(String(value));
                    default:
                        return current == value;
                }
            });
        });
    },
})