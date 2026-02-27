/**
 * Created by nan on 2019/8/14.
 * input file中记录文件的fileList是只读的,无法修改;
 * 只能自己定义新的FormData对象，再进行数据的封装，通过ajax发送请求,
 * 注意：这里的pdf处理出来的文件width,height，是否和文件服务器处理时返回的结果相同
 */


Ext.define('CGP.background.view.image.ImagesPanel', {
    extend: 'Ext.panel.Panel',
    border: false,
    requires: ['Ext.ux.form.field.TriggerField', 'Ext.ux.form.field.FileField'],
    layout: 'fit',
    valid: true,//标识编辑状态
    alias: 'widget.imagespanel',
    fileArray: null,//复制的filelist，用于创建新的FormData中传输文件
    removeFileArr: null,
    isValid: function () {
        var me = this;
        return me.validate();
    },
    getName: function () {
        return this.name;
    },
    getErrors: function () {
        return '不允许为空';
    },
    getFieldLabel: function () {
        return '图片'
    },
    //当grid添加数据之后清除不能为空的错误提示。
    clearError: function () {
        var me = this;
        var form = me.items.items[0];
        form.body.setStyle('borderColor', 'silver #d9d9d9 #d9d9d9');

    },
    renderActiveError: function () {
        var me = this;
        var form = me.items.items[0];
        if (me.rendered && !me.isDestroyed && !me.preventMark) {
            if (form) {
                if (me.valid == false) {
                    me.body.setStyle('borderColor', '#cf4c35');
                } else {
                    me.body.setStyle('borderColor', 'silver #d9d9d9 #d9d9d9')
                }
            }
        }
    },
    //重写displayfield的验证方法，根据grid有无值来校验
    validate: function () {
        var me = this;
        if (me.disabled) {
            return true;
        }
        if (me.fileArray.length == 0) {
            me.valid = false;
        } else {
            me.valid = true;
        }
        me.renderActiveError();
        return me.valid;
    },
    getValue: function () {
        var me = this;
        return [];
    },
    initComponent: function () {
        var me = this;
        //添加自定义事件
        me.addEvents({
            countChange: true,//选择的文件数量发生改变
            allFileRender: true
        });
        me.fileArray = [];
        me.removeFileArr = [];
        /**
         * 删除选择的文件
         * @param itemId
         */
        window.deleteFile = function (itemId) {
            var field = Ext.getCmp(itemId);
            var form = field.ownerCt;
            var panel = form.ownerCt;
            var index = field.ownerCt.items.items.indexOf(field);
            panel.fileArray.splice(index, 1);
            form.remove(field);
            panel.fireEvent('countChange', {count: panel.fileArray.length});
        };
        /*
                /!**
                 * 下载文件
                 * @param itemId
                 *!/
                window.downLoad = function (itemId) {
                    var field = Ext.getCmp(itemId);
                    var fileName = field.fileName;
                    const a = document.createElement('a');
                    a.setAttribute('href', 'http://192.168.26.26:8080/file/file/' + '5d630a3f5615d215fe104cd67a293415.pdf');
                    a.setAttribute("download", fileName);
                    a.click();
                };
        */
        /**
         * 查看图片
         * @param itemId
         */
        window.preview = function (itemId) {
            var field = Ext.getCmp(itemId);
            var fileName = field.name;
            var canvas = field.el.dom.getElementsByTagName('canvas')[0];
            var win = Ext.create('Ext.ux.window.CheckImageWindow', {
                src: canvas.toDataURL(),
                title: i18n.getKey('图片_') + fileName
            });
            win.show();
        };
        me.items = [
            {
                xtype: 'form',
                border: false,
                header: false,
                width: "100%",
                flex: 1,
                autoScroll: true,
                itemId: 'previewForm',
                layout: {
                    type: 'column'
                },
                bodyStyle: 'border-color:silver;',
                items: [],
                addImage: function (fieldId, fileName, deleteImgUrl, previewImgUrl) {
                    var me = this;
                    var data = {
                        id: fieldId,
                        fileName: fileName,
                        name: fileName,
                        xtype: 'displayfield',
                        columnWidth: 0.2,
                        hideLabel: true,
                        uploadId: JSGetUUID(),
                        value: "<div>" +
                            "<div  align='center' style='margin:0px 10px 0px 10px;border: 1px solid #e2e2e4;border-radius:10px;height: auto;height: 150px;' id=" + 'img-' + fieldId + "></div>" +
                            "<div align='center'  style='white-space:normal;word-wrap:break-word; overflow:hidden;'>" + fileName + "</div>" +
                            "<div align='center'>" +
                            "<img title='删除' src='" + deleteImgUrl + "' style='vertical-align: middle;width:16px; height:16px; margin-right:8px;' onclick='deleteFile(\"" + fieldId + "\")'/>" +
                            "<img title='查看' src='" + previewImgUrl + "' style='vertical-align: middle;width:16px; height:16px; margin-left:8px;' onclick='preview(\"" + fieldId + "\")'/>" +
                            "</div>" +
                            "</div>"
                    };
                    me.add(data);
                },
                /**
                 *
                 * @param pdfFileURL 文件路径
                 * @param file 具体的file类型对象
                 * @param img  需要渲染图片的位置
                 */
                buildImg: function (item, fieldId, previewForm, panel, files) {
                    var reader = new FileReader();
                    reader.readAsDataURL(item);
                    reader.onload = function (e) {
                        var canvas = document.createElement('canvas');
                        var ctx = canvas.getContext('2d');
                        //加载图片
                        var img = new Image();
                        img.onload = function () {
                            canvas.width = img.width;
                            canvas.height = img.height;
                            if ((imgDiv.offsetWidth / img.width) * img.height > imgDiv.offsetHeight) {
                                canvas.style.height = '100%';
                            } else {
                                canvas.style.width = '100%';
                            }
                            canvas.style.position = 'relative';
                            canvas.style.top = '50%';
                            canvas.style.left = '50%';
                            canvas.style.transform = 'translate(-' + 50 + '%,-' + 50 + '%)';
                            //图片点击预览
                            canvas.onclick = function () {
                                window.preview(fieldId);
                            };
                            //鼠标指针样式
                            canvas.onmouseover = function () {
                                this.style.cursor = 'pointer';
                            }
                            //绘制图片
                            ctx.drawImage(img, 0, 0, img.width, img.height);
                        };
                        img.src = reader.result;
                        var deleteImg = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png';
                        var previewImg = path + 'ClientLibs/extjs/resources/themes/images//shared/fam/preview.png';
                        var fileName = item.name + '(' + Math.ceil(img.width) + '*' + Math.ceil(img.width) + ')';
                        previewForm.addImage(fieldId, fileName, deleteImg, previewImg);
                        var imgDiv = document.getElementById('img-' + fieldId);
                        imgDiv.append(canvas);

                    }
                },
                /**
                 *pdf文件先转换成图片
                 * @param pdfFileURL 文件路径
                 * @param file 具体的file类型对象
                 * @param img  需要渲染图片的位置
                 */
                buildcanvas: function (pdfFileURL, file, panel, files, index) {
                    var previewForm = this;
                    var pdfFileURL = pdfFileURL;
                    if (pdfFileURL) {
                        var reader = new FileReader();
                        reader.readAsArrayBuffer(file);
                        reader.onload = function (e) {
                            new Uint8Array(e.target.result);
                            var typedarray = new Uint8Array(this.result);
                            PDFJS.getDocument(typedarray).then(function (pdf) { //PDF转换为canvas
                                if (pdf) {
                                    var pageNum = pdf.numPages;
                                    for (var i = 1; i <= pageNum; i++) {
                                        var canvas = document.createElement('canvas');
                                        canvas.title = '点击查看';
                                        var context = canvas.getContext('2d');
                                        openPage(pdf, i, context, panel, files, file, index, files.length);
                                    }
                                }
                            });
                        };
                    }

                    /**
                     * 生成对应的图片渲染异步任务
                     * @param pdfFile
                     * @param pageNumber
                     * @param context
                     */
                    function openPage(pdfFile, pageNumber, context, panel, files, file, index, filesCount) {
                        var scale = 1;//比例
                        var fieldId = JSGetUUID();
                        pdfFile.getPage(pageNumber).then(function (page) {
                            var viewport = page.getViewport(scale); // reference canvas via context
                            var canvas = context.canvas;
                            canvas.width = viewport.width;
                            canvas.height = viewport.height;
                            canvas.onmouseover = function () {
                                this.style.cursor = 'pointer';
                            };
                            canvas.onclick = function () {
                                window.preview(fieldId);
                            };
                            var fileName = file.name + '(' + Math.ceil(viewport.width) + '*' + Math.ceil(viewport.height) + ')';
                            if (true/*Math.round(viewport.width) == panel.width && Math.round(viewport.height) == panel.height*/) {//没有文件大小限制
                                var deleteImg = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png';
                                var previewImg = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/preview.png';
                                previewForm.addImage(fieldId, fileName, deleteImg, previewImg);
                                var img = document.getElementById('img-' + fieldId);
                                img.append(canvas);
                                console.log(canvas.width + '-' + canvas.height);
                                if (canvas.width > canvas.height) {
                                    canvas.style.width = "100%";//以大的一方为约束
                                    canvas.style.position = 'relative';
                                    canvas.style.top = '50%';
                                    canvas.style.left = '50%';
                                    canvas.style.transform = 'translate(-50%,-50%)';
                                } else {
                                    canvas.style.height = "100%";
                                }
                                var renderContext = {
                                    canvasContext: context,
                                    viewport: viewport
                                };
                                page.render(renderContext);
                            } else {
                                panel.removeFileArr.push(files[index]);
                                files.splice(index, 1);
                            }
                        });
                        return;
                    }
                },
                tbar: [
                    {
                        xtype: 'filefield',
                        buttonOnly: true,
                        buttonConfig: {
                            iconCls: 'icon_folder',
                            text: i18n.getKey('选择文件')
                        },
                        /**
                         * 设置文件上传组件的配置
                         * @param field
                         */
                        supporMultFn: function (field) {
                            //允许使用的文件类型
                            var typeArray = [
                                "application/pdf",
                                /*
                                                                "image/svg+xml"
                                */
                            ];
                            var fileDom = field.getEl().down('input[type=file]');
                            fileDom.dom.setAttribute("multiple", "multiple");
                            fileDom.dom.setAttribute("accept", typeArray.join(","));
                            if (!Ext.isEmpty(this.uploadFolder) && this.uploadFolder == true) {
                                fileDom.dom.setAttribute('webkitdirectory', 'webkitdirectory');
                            }
                        },
                        listeners: {
                            afterrender: function () {
                                this.supporMultFn(this);
                            },
                            change: function (comp, newValue, oldValue) {
                                this.supporMultFn(this);
                                var previewForm = comp.ownerCt.ownerCt;
                                var panel = previewForm.ownerCt;
                                var fileInput = this.fileInputEl.dom;
                                var files = this.fileInputEl.dom.files;
                                var filePath = this.value;
                                filePath = filePath.substring(0, filePath.lastIndexOf('\\') + 1);
                                //处理无法重复选择同一文件
                                fileInput.type = 'text';
                                fileInput.type = 'file';
                                //进行图片的预览显示
                                var fileArr = [];
                                Array.prototype.push.apply(fileArr, files);//复制文件信息
                                Ext.Array.each(files, function (item, index) {
                                    var fieldId = JSGetUUID();
                                    var pdfFileURL = filePath + item.name;
                                    if (item.type == 'application/pdf') {
                                        //pdf类型
                                        previewForm.buildcanvas(pdfFileURL, item, panel, fileArr, index);
                                    } else {//图片类型
                                        previewForm.buildImg(item, fieldId, previewForm, panel, files);
                                    }
                                });
                                Array.prototype.push.apply(panel.fileArray, files);//复制文件信息
                                panel.fireEvent('allFileRender');
                                panel.fireEvent('countChange');
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        text: i18n.getKey('clear'),
                        iconCls: 'icon_clear',
                        handler: function (btn) {
                            var previewForm = btn.ownerCt.ownerCt;
                            var panel = previewForm.ownerCt;
                            panel.fileArray = [];
                            previewForm.removeAll();
                            panel.fireEvent('countChange', {
                                count: 0
                            });
                        }
                    }
                ]
            }
        ];
        me.listeners = {
            'countChange': function () {
                var me = this;
                me.validate();
            }
        };
        me.callParent();
    }
})
