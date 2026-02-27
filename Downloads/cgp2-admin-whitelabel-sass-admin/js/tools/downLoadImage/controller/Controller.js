/**
 * @author xiu
 * @date 2024/7/29
 */
Ext.define('CGP.tools.downLoadImage.controller.Controller', {
    id: JSGetQueryString('id'),
    compGather: {
        '标题项': 'Ext.ux.form.field.CreateTitleItem',
        'window下一步功能': 'Ext.ux.form.field.CreateNextStepWindow',
        'combo切换模板功能': 'Ext.ux.form.field.CreateChangeCombo',
        '范围输入框': 'Ext.ux.form.field.MinMaxField',
        '拉取中组件': 'Ext.ux.form.field.CreateLoadingComp',
    },

    //修改
    editQuery: function (url, jsonData, isEdit) {
        var data = [],
            method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';

        JSAjaxRequest(url, method, false, jsonData, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        }, true);
        return data
    },

    //查询
    getQuery: function (url) {
        var data = [];

        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        }, true);
        return data;
    },

    //删除
    deleteQuery: function (url, store, otherConfig) {
        JSAjaxRequest(url, 'DELETE', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    store && store.load();
                }
            }
        }, true, otherConfig)
    },

    //获取url
    getUrl: function (author, params) {
        const id = params?.id;
        var urlGather = {
            mainUrl: 'api/colors',
            addPart: 'addPart',
            deletePart: 'deletePart',
            selectPart: 'selectPart' + id,
            deletePartGrid: 'deletePartGrid' + id
        }
        return adminPath + urlGather[author];
    },

    //异步修改存在加载动画
    asyncEditQuery: function (url, jsonData, isEdit, callFn, hideMsg, otherConfig) {
        var method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';

        JSAjaxRequest(url, method, true, jsonData, !hideMsg && successMsg, callFn, true, otherConfig);
    },


    // 过滤属性版本的get请求
    getAttributeVersionQuery: function (url, attributeVersionId) {
        var data = [];

        JSAjaxRequestForAttributeVersion(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        }, false, attributeVersionId);
        return data;
    },

    // 过滤属性版本的edit请求
    editAttributeVersionQuery: function (url, jsonData, isEdit, attributeVersionId) {
        var data = [],
            method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';

        JSAjaxRequestForAttributeVersion(url, method, false, jsonData, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        }, true, attributeVersionId);
        return data
    },

    // 过滤属性版本的edit请求
    asyncEditAttributeVersionQuery: function (url, jsonData, isEdit, callFn, hideMsg, attributeVersionId) {
        var method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';


        JSAjaxRequestForAttributeVersion(url, method, true, jsonData, !hideMsg && successMsg, callFn, true, attributeVersionId);
    },

    // 创建选图grid窗口
    createSelectImageGridWindow: function (store, imageServer, callBack) {
        var controller = this,
            storeData = store.proxy.data;

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('选择_下载图片'),
            width: 1000,
            height: 600,
            items: [
                {
                    xtype: 'searchcontainer',
                    name: 'searchcontainer',
                    itemId: 'searchcontainer',
                    filterCfg: {
                        header: false,
                        layout: {
                            type: 'table',
                            columns: 3
                        },
                        defaults: {
                            isLike: false
                        },
                        searchActionHandler: function () { //重写搜索按钮方法
                            var me = this,
                                form = me.ownerCt.ownerCt,
                                searchcontainer = form.ownerCt,
                                store = searchcontainer.grid.store,
                                filterData = form.getQuery()

                            if (filterData.length) {
                                store.proxy.data = JSGetFilteredValues(filterData, storeData);
                            } else {
                                store.proxy.data = storeData;
                            }
                            store.load();
                        },
                        items: [
                            {
                                xtype: 'numberfield',
                                name: 'imageId',
                                itemId: 'imageId',
                                hideTrigger: true,
                                fieldLabel: i18n.getKey('id'),
                                margin: '5 10'
                            },
                            {
                                xtype: 'textfield',
                                name: 'imageName',
                                itemId: 'imageName',
                                isLike: true,
                                fieldLabel: i18n.getKey('url'),
                                margin: '5 10'
                            },
                        ]
                    },
                    gridCfg: {
                        editAction: false,
                        deleteAction: false,
                        store: store,
                        columnDefaults: {
                            tdCls: 'vertical-middle',
                            align: 'center',
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip ="' + value + '"';
                                return value
                            }
                        },
                        tbar: [
                            {
                                xtype: 'button',
                                name: 'selectedAll',
                                itemId: 'selectedAll',
                                iconCls: 'icon_all_selected',
                                text: i18n.getKey('一键添加所有'),
                                handler: function (btn) {
                                    var grid = btn.ownerCt.ownerCt,
                                        win = grid.ownerCt.ownerCt;

                                    callBack && callBack(storeData);
                                    win.close();
                                }
                            }
                        ],
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                width: 120,
                                align: 'center',
                                dataIndex: 'imageId',
                            },
                            {
                                xtype: 'imagecolumn',
                                tdCls: 'vertical-middle',
                                width: 100,
                                dataIndex: 'imageName',
                                align: 'center',
                                text: i18n.getKey('image'),
                                //订单的缩略图特殊位置
                                buildUrl: function (value, metadata, record) {
                                    return imageServer + value;
                                },
                                //订单的缩略图特殊位置
                                buildPreUrl: function (value, metadata, record) {
                                    return imageServer + value + '/100/100';
                                },
                                buildTitle: function (value, metadata, record) {
                                    return `${i18n.getKey('check')} < ${value} > 预览图`;
                                }
                            },
                            {
                                xtype: 'atagcolumn',
                                text: i18n.getKey('url'),
                                dataIndex: 'imageName',
                                align: 'center',
                                flex: 1,
                                getDisplayName: function (value, metadata, record) {
                                    return JSCreateHyperLink(value);
                                },
                                clickHandler: function (value, metadata, record) {
                                    window.open(imageServer + value);
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
                            callBack && callBack(selected);
                            win.close();
                        } else {
                            Ext.Msg.alert('提示', '请至少选择一条数据!')
                        }
                    }
                }
            },
        }).show();
    },

    //获取过滤key value后的对象
    getFilteredValues: function (filters, data) {
        var result = new Set(); // 使用 Set 来存储唯一值

        data.forEach(item => {
            filters.forEach(filterItem => {
                var {name, value, type, operator} = filterItem,
                    isExactMatch = operator === 'exactMatch',
                    isValue = '',
                    isType = true; // 默认设置为 true

                // 处理嵌套属性
                const keys = name.split('.');
                let fieldValue = item;

                for (const key of keys) {
                    if (fieldValue !== undefined) {
                        fieldValue = fieldValue[key];
                    }
                }

                if (fieldValue !== undefined) {
                    isType = (typeof fieldValue) === type; // 检查类型

                    // 根据是否开启精确匹配或模糊匹配来判断
                    if (isExactMatch) {
                        isValue = fieldValue === value; // 精确匹配
                    } else {
                        if (typeof fieldValue === 'string') {
                            isValue = fieldValue.includes(value); // 模糊匹配
                        } else {
                            isValue = fieldValue === value; // 精确匹配
                        }
                    }

                    if (isValue && isType) {
                        result.add(JSON.stringify(item)); // 使用 JSON.stringify 保证对象唯一性
                    }
                }
            });
        });

        // 将 Set 转换回数组并解析 JSON 字符串
        return Array.from(result).map(item => JSON.parse(item));
    },

    // 创建选择下载文件类型窗口
    createDownFileTypeFormWindow: function (data, callBack) {
        var controller = this

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('选择_下载类型'),
            width: 400,
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    defaults: {
                        margin: '10 25 5 25',
                        allowBlank: true
                    },
                    layout: 'vbox',
                    diyGetValue: function () {
                        var me = this,
                            result = {},
                            items = me.items.items;
                        items.forEach(item => {
                            var name = item['name'];
                            result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue()
                        })
                        return result;
                    },
                    diySetValue: function (data) {
                        var me = this,
                            items = me.items.items;
                        items.forEach(item => {
                            var {name} = item;
                            item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name])
                        })
                    },
                    items: [
                        {
                            xtype: 'combo',
                            fieldLabel: i18n.getKey('文件格式'),
                            itemId: 'downFileFormat',
                            name: 'downFileFormat',
                            labelWidth: 100,
                            width: '100%',
                            // margin: '10 0 0 50',
                            valueField: 'key',
                            displayField: 'value',
                            allowBlank: false,
                            editable: false,
                            value: '',
                            store: {
                                fields: ['key', 'value'],
                                data: [
                                    {
                                        key: '',
                                        value: '原格式',
                                    },
                                    {
                                        key: 'jpg',
                                        value: 'JPG',
                                    },
                                    {
                                        key: 'png',
                                        value: 'PNG',
                                    },
                                ]
                            }
                        },
                        {
                            xtype: 'createChangeCombo',
                            name: 'downFile',
                            itemId: 'downFile',
                            width: '100%',
                            isFormField: true,
                            // 内部combo的配置
                            isDirty: Ext.emptyFn,
                            // combo内的组件
                            defaults: {

                            },
                            comboCfg: {
                                fieldLabel: i18n.getKey('下载类型'),
                                name: 'downFileType',
                                valueField: 'key',
                                margin: '0 0 10 0',
                                displayField: 'value',
                                allowBlank: false,
                                value: 'file',
                                store: {
                                    fields: ['key', 'value'],
                                    data: [
                                        {
                                            key: 'file',
                                            value: '文件',
                                        },
                                        {
                                            key: 'package',
                                            value: '压缩包',
                                        },
                                    ]
                                }
                            },
                            // 所有使用的组件
                            componentCfg: {
                                packageName: {
                                    xtype: 'textfield',
                                    name: 'packageName',
                                    itemId: 'packageName',
                                    fieldLabel: i18n.getKey('压缩包名称'),
                                    allowBlank: false,
                                },
                            },
                            // 每个选项需要显示的组件
                            comboGather: {
                                file: {
                                    items: []
                                },
                                package: {
                                    items: ['packageName'],
                                },
                            }
                        },
                        {
                            xtype: 'radiogroup',
                            colspan: 2,
                            labelWidth: 130,
                            isFormField: true,
                            name: 'filterDowned',
                            itemId: 'filterDowned',
                            fieldLabel: i18n.getKey('是否过滤已下载'),
                            items: [
                                {
                                    boxLabel: '是',
                                    width: 100,
                                    name: 'isFilterDowned',
                                    inputValue: true,
                                    checked: true
                                },
                                {
                                    boxLabel: '否',
                                    width: 100,
                                    name: 'isFilterDowned',
                                    inputValue: false
                                }
                            ],
                        },
                    ],
                    listeners: {
                        afterrender: function (comp) {
                            data && comp.diySetValue(data);
                        }
                    }
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            form = win.getComponent('form'),
                            formData = form.diyGetValue();


                        if (form.isValid()) {
                            console.log(formData);
                            callBack && callBack(formData);
                            win.close();
                        }
                    }
                }
            },
        }).show();
    },

    // 获取文件格式
    getFileFormat: function (filename) {
        // 获取文件扩展名
        const extension = filename.split('.').pop().toLowerCase(); // 获取扩展名并转换为小写

        /*// 定义文件类型映射
        const mimeTypes = {
            jpg: 'image/jpg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif',
            bmp: 'image/bmp',
            svg: 'image/svg+xml',
            pdf: 'application/pdf',
            txt: 'text/plain',
            // 可以添加更多类型
        };*/

        // 返回对应的 MIME 类型
        return extension || ''; // 如果没有找到，返回 ''
    },

    abortController: null, // 用于存储 AbortController 实例
    completedDownloads: 0, // 记录成功下载的数量
    failedDownloads: 0, // 记录失败下载的数量
    totalFiles: 0, // 记录总下载文件数量

    // 一键下载图片
    downloadImages: async function (params, imageServer) {
        /**
         * 下载图片
         * @param {Array} array - 包含待下载图片信息的对象数组，每个对象应包含 imageName 属性
         * @param {Function} onImageDownload - 每张图片下载完毕的回调函数，接收两个参数：
         *   @param {boolean} success - 表示该图片是否下载成功
         *   @param {string} message - 失败时的错误信息
         * @param {Function} onAllDownloadsComplete - 所有图片下载完成后的回调函数，接收三个参数：
         *   @param {Array} results - 包含每个下载结果的对象数组，每个对象包含:
         *     @param {string} imageName - 图片名称
         *     @param {string} url - 下载用的 URL
         *     @param {boolean} isSuccess - 是否完成下载
         *     @param {string} message - 错误信息（如果有的话）
         *   @param {Array} filterResults - 被过滤的已下载数据结果
         */

        var controller = this,
            {array, packageName, onImageDownload, onAllDownloadsComplete, btn, isFilterDowned, downFileFormat} = params;

        controller.abortController = new AbortController(); // 创建一个新的 AbortController 实例
        const signal = controller.abortController.signal; // 获取信号

        // 过滤已下载的文件
        const filterResults = isFilterDowned
            ? array.filter(item => item.isSuccess === 'success') // 只保留已下载的文件
            : [];

        // 只下载未成功下载的文件
        const filteredArray = isFilterDowned
            ? array.filter(item => item.isSuccess !== 'success')
            : array;

        controller.totalFiles = filteredArray.length; // 设置总文件数量
        const results = []; // 用于存储每个下载结果

        for (let i = 0; i < filteredArray.length; i++) {
            const fileName = filteredArray[i].imageName;
            const imageId = filteredArray[i].imageId;

            let result = {imageId: imageId, imageName: fileName, isSuccess: 'failure', message: ''},
                originFileFormat = controller.getFileFormat(fileName) || 'jpg',
                fileFormat = downFileFormat || originFileFormat;

            try {
                const response = await fetch(imageServer + fileName + `/${fileFormat}`, {signal}); // 将信号传递给 fetch

                if (!response.ok) {
                    result.isSuccess = 'failure';
                    result.message = `下载文件 ${fileName} 时出错: ${response.status} ${response.statusText}`;
                    console.error(result.message);
                    controller.failedDownloads++; // 增加失败计数
                    results.push(result);
                    onImageDownload(false, result.message, btn); // 调用单个下载回调
                    continue; // 跳过当前文件
                }

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);

                // 创建一个临时链接元素
                const a = document.createElement('a');
                a.href = url;
                a.download = `${fileName}.${fileFormat}`; // 使用序号命名下载的文件
                document.body.appendChild(a);
                a.click(); // 触发下载
                document.body.removeChild(a); // 移除临时链接
                URL.revokeObjectURL(url); // 释放内存

                // 下载成功，记录文件名
                console.log(`下载成功: ${fileName}`);
                result.isSuccess = 'success';
                controller.completedDownloads++; // 增加成功计数
                results.push(result);
                onImageDownload(true, '', btn); // 调用单个下载回调
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('下载被取消');
                    // 将未下载的数据存回结果数组
                    const incompleteResults = filteredArray.slice(i).map(item => ({
                        imageId: item.imageId,
                        imageName: item.imageName,
                        isSuccess: 'waiting',
                        message: '未下载'
                    }));
                    results.push(...incompleteResults); // 添加未下载的文件
                    break; // 退出循环
                }
                result.isSuccess = 'failure';
                result.message = `下载文件 ${fileName} 时发生异常: ${error.message}`;
                console.error(result.message);
                controller.failedDownloads++; // 增加失败计数
                results.push(result);
                onImageDownload(false, result.message, btn); // 调用单个下载回调
            }

            // 输出当前状态
            console.log(`已完成: ${controller.completedDownloads}, 失败: ${controller.failedDownloads}, 总共: ${controller.totalFiles}`);

            // 添加延迟，单位为毫秒
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1000毫秒
        }

        // 所有下载完成后的回调
        onAllDownloadsComplete(results, filterResults, btn); // 传递被过滤的已下载数据结果
    },

    // 一键下载压缩包
    downloadZip: async function (params, imageServer) {
        /**
         * 下载压缩包
         * @param {Array} array - 包含待下载图片信息的对象数组，每个对象应包含 imageName 属性
         * @param {string} packageName - 压缩包的名称
         * @param {Function} onImageDownload - 每张图片下载完毕的回调函数，接收两个参数：
         *   @param {boolean} success - 表示该图片是否下载成功
         *   @param {string} message - 失败时的错误信息
         * @param {Function} onAllDownloadsComplete - 所有图片下载完成后的回调函数，接收三个参数：
         *   @param {Array} results - 包含每个下载结果的对象数组，每个对象包含:
         *     @param {string} imageName - 图片名称
         *     @param {string} url - 下载用的 URL
         *     @param {boolean} isSuccess - 是否完成下载
         *     @param {string} message - 错误信息（如果有的话）
         *   @param {Array} filterResults - 被过滤的已下载数据结果
         */

        var controller = this,
            {array, packageName, onImageDownload, onAllDownloadsComplete, btn, isFilterDowned, downFileFormat} = params;

        controller.abortController = new AbortController(); // 创建一个新的 AbortController 实例
        const signal = controller.abortController.signal; // 获取信号
        const zip = new JSZip(); // 创建一个新的 ZIP 实例

        // 过滤已下载的文件
        const filterResults = isFilterDowned
            ? array.filter(item => item.isSuccess === 'success') // 只保留已下载的文件
            : [];

        // 只下载未成功下载的文件
        const filteredArray = isFilterDowned
            ? array.filter(item => item.isSuccess !== 'success')
            : array;

        controller.totalFiles = filteredArray.length; // 设置总文件数量
        const results = []; // 用于存储每个下载结果

        for (let i = 0; i < filteredArray.length; i++) {
            const fileName = filteredArray[i].imageName;
            const imageId = filteredArray[i].imageId;
            let result = {imageId: imageId, imageName: fileName, isSuccess: 'failure', message: ''},
                originFileFormat = controller.getFileFormat(fileName) || 'jpg',
                fileFormat = downFileFormat || originFileFormat;

            try {
                const response = await fetch(imageServer + fileName + `/${fileFormat}`, {signal}); // 将信号传递给 fetch

                if (!response.ok) {
                    result.isSuccess = 'failure';
                    result.message = `下载文件 ${fileName} 时出错: ${response.status} ${response.statusText}`;
                    console.error(result.message);
                    controller.failedDownloads++; // 增加失败计数
                    results.push(result);
                    onImageDownload(false, result.message, btn); // 调用单个下载回调
                    continue; // 跳过当前文件
                }

                const blob = await response.blob();
                zip.file(`${fileName}.${fileFormat}`, blob); // 将文件添加到 ZIP 中
                controller.completedDownloads++; // 增加成功计数
                result.isSuccess = 'success';
                results.push(result);
                onImageDownload(true, '', btn); // 调用单个下载回调
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('下载被取消');
                    // 将未下载的数据存回结果数组
                    const incompleteResults = filteredArray.slice(i).map(item => ({
                        imageId: item.imageId,
                        imageName: item.imageName,
                        isSuccess: 'waiting',
                        message: '未下载'
                    }));
                    results.push(...incompleteResults); // 添加未下载的文件
                    break; // 退出循环
                }
                result.isSuccess = 'failure';
                result.message = `下载文件 ${fileName} 时发生异常: ${error.message}`;
                console.error(result.message);
                controller.failedDownloads++; // 增加失败计数
                results.push(result);
                onImageDownload(false, result.message, btn); // 调用单个下载回调
            }

            // 输出当前状态
            console.log(`已完成: ${controller.completedDownloads}, 失败: ${controller.failedDownloads}, 总共: ${controller.totalFiles}`);

            // 添加延迟，单位为毫秒
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1000毫秒
        }

        // 生成 ZIP 文件并触发下载
        try {
            const zipBlob = await zip.generateAsync({type: "blob"});
            const url = URL.createObjectURL(zipBlob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `${packageName}.zip`; // 使用压缩包名命名 ZIP 文件
            document.body.appendChild(a);
            a.click(); // 触发下载
            document.body.removeChild(a); // 移除临时链接
            URL.revokeObjectURL(url); // 释放内存
        } catch (error) {
            console.error(`生成 ZIP 文件时发生异常: ${error.message}`);
        }

        // 所有下载完成后的回调
        onAllDownloadsComplete(results, filterResults, btn); // 传递被过滤的已下载数据结果
    },

    // 取消下载的方法
    cancelDownload: function (callBack) {
        /**
         * 取消当前的下载任务
         * @param {Function} callBack - 取消下载后的回调函数
         */
        var controller = this;
        if (controller.abortController) {
            controller.abortController.abort(); // 取消下载
            controller.abortController = null; // 重置 AbortController
            console.log('所有下载进程已取消');
            callBack && callBack();
        }
    },

    // 主调用方法
    oneKeyDownLoadFiles: function (params, imageServer) {
        /**
         * 主调用方法，启动下载过程
         * @param {Array} array - 包含待下载图片信息的对象数组，每个对象应包含 imageName 属性
         * @param {string} packageName - 压缩包的名称（如果下载为压缩包）
         * @param {Function} onImageDownload - 每张图片下载完毕的回调函数，接收两个参数：
         *   @param {boolean} success - 表示该图片是否下载成功
         *   @param {string} message - 失败时的错误信息
         * @param {Function} onAllDownloadsComplete - 所有图片下载完成后的回调函数，接收三个参数：
         *   @param {Array} results - 包含每个下载结果的对象数组，每个对象包含:
         *     @param {string} imageName - 图片名称
         *     @param {string} url - 下载用的 URL
         *     @param {boolean} isSuccess - 是否完成下载
         *     @param {string} message - 错误信息（如果有的话）
         *   @param {Array} filterResults - 被过滤的已下载数据结果
         */

        var controller = this,
            {packageName} = params;

        controller.completedDownloads = 0; // 重置成功计数
        controller.failedDownloads = 0; // 重置失败计数
        controller.totalFiles = 0; // 重置总文件计数

        if (packageName) {
            controller.downloadZip(params, imageServer); // 下载为压缩包
        } else {
            controller.downloadImages(params, imageServer); // 直接下载图片
        }
    },

    // 转为下载图片列表数据格式
    getMemoryData: function (array, isDeduplication) {
        // 精确下载第几张
        /*selectItem.forEach(item => {
            result2.push(result[item - 1])
        })*/

        //去重
        if (isDeduplication) {
            array = [...new Set(array)]
        }

        // 转格式
        var result = array.map(item => {
            return {
                imageName: item,
                isSuccess: false
            }
        })

        /*var result2 = [
            {
                "imageName": "f9c60fb154e50807ee5e08c76cf22420.png",
                "isSuccess": false
            },
        ]*/

        return result;
    },

    getProductInstanceEnLatestV3: function (productInstanceId) {
        var url = adminPath + `api/productInstances/productInstance/${productInstanceId}/en/latest/v3`,
            queryData = JSGetQuery(url),
            sbomNodeRuntimeId = queryData?.sbomNodeRuntimeId;

        return sbomNodeRuntimeId;
    },

    getPageContentImageRelation: function (sbomNodeRuntimeId) {
        var url = adminPath + `api/sbomNode/pagecontent/image/relation?sbNodeRuntimeId=${sbomNodeRuntimeId}`,
            queryData = JSGetQuery(url),
            uniqueObjects = (arr, key) => {  // 对象去重
                const seen = new Set();
                return arr.filter(item => {
                    const serialized = item[key];
                    return seen.has(serialized) ? false : seen.add(serialized);
                });
            };

        return uniqueObjects(queryData, 'imageId');
    }
})