Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.controller.TransformController', {
    /**
     * 组件DTO数组转化成domain组件数组
     * @param componentConfigs
     * @returns {*[]}
     */
    componentConfigTransform: function (componentConfigs) {
        var me = this;
        var compDomainConfigs = [];
        Ext.Array.each(componentConfigs, function (componentConfig) {
            compDomainConfigs.push(me.ordinaryComCfgTransform(Ext.clone(componentConfig)));
        })
        return compDomainConfigs;
    },
    //导航组件类型配置转换
    /**
     * 为每个组件新建id
     * @param navbarCompConfig
     * @returns {*}
     */
    navbarComponentConfigTransform: function (navbarCompConfig) {
        return navbarCompConfig;

    },
    //assistans中关联组件为实例数据
    ordinaryComCfgTransform: function (componentConfig) {
        if (componentConfig.clazz == 'com.qpp.cgp.domain.product.config.view.builder.config.v3.AssistBarConfig') {
            var assistants = componentConfig.assistants;
            for (var i = 0; i < assistants.length; i++) {
                //在数组列表中找出对应的组件配置数据
                var componentId = assistants[i].relateComponent._id;
                for (var j = 0; j < window.componentArr.length; j++) {
                    if (componentId == window.componentArr[j]._id) {
                        componentConfig.assistants[i].relateComponent = Ext.clone(window.componentArr[j]);
                        continue;
                    }
                }
            }
        }
        return componentConfig;
    },
    /**
     * builderViewConfigDto转domain方法
     * @param dto
     * @constructor
     */
    DTOTransformDomain: function (dto) {
        var me = this;
        //domain模板
        var domain = {
            _id: dto.builderViewConfigDomain ? dto.builderViewConfigDomain._id : JSGetCommonKey(false),
            productConfigViewId: dto.productConfigViewId,
            clazz: 'com.qpp.cgp.domain.product.config.view.builder.config.v3.OrdinaryBuilderViewConfig',
            editViewConfigs: [],
            defaultThemes: dto.defaultThemes,
            componentConfigs: []
        };
        //componentConfigs转化
        domain.componentConfigs = me.componentConfigTransform(dto.componentConfigs);
        //editViewConfigs转换
        domain.editViewConfigs = me.transformEditViewConfigs(dto.editViewConfigs, domain);

  /*      //合并domain中自定义的修改
        var domainComponents = dto.builderViewConfigDomain.componentConfigs;
        domain.componentConfigs = domain.componentConfigs.map(function (item) {
            var itemId = item._id;
            for (var i = 0; i < domainComponents.length; i++) {
                if (itemId == domainComponents[i]._id) {
                    item = Ext.Object.merge(domainComponents[i], item);
                    break;
                }
            }
            return item;
        })*/
        return domain;
    },
    //editViewConfigs转换
    transformEditViewConfigs: function (editViewConfigs, domain) {
        var me = this;
        var editViewDomainConfigs = [];
        Ext.Array.each(editViewConfigs, function (item) {
            var editViewConfig = {
                builderView: {
                    clazz: domain.clazz,
                    _id: domain._id
                },
                configs: [],
                navItem: {
                    id: item.navItemId,
                    clazz: 'com.qpp.cgp.domain.product.config.view.navigation.config.v3.FixedNavItemConfig'
                },
                editViewType: item.editViewType.editViewTypeDomain,
                id: item.id
            };
            Ext.Array.each(item.configs, function (editViewData) {
                editViewConfig.configs.push(me.editViewDataTransDomain(editViewData, item, domain))
            })
            editViewDomainConfigs.push(editViewConfig)
        });
        return editViewDomainConfigs;

    },
    //editViewDataDto assistant中关联的是实例数据
    editViewDataTransComp: function (editViewDataConfig, dtoOrDomainComp, domain) {
        var localData = Ext.clone(editViewDataConfig);
        return {
            clazz: localData.clazz,
            _id: localData._id
        };
    },
    //editViewDataDto 转成editViewComponentDomain
    editViewDataTransDomain: function (editViewDataConfig, editViewConfig, domain) {
        var me = this;
        var editViewComponent = {
            config: {},
            componentPath: '',
            editView: {
                id: editViewConfig.id,
                clazz: 'com.qpp.cgp.domain.product.config.view.builder.config.v3.EditViewConfig'
            }
        }
        var localData = Ext.clone(editViewDataConfig);
        /*
                delete localData._id;
        */
        //特殊处理。一下几种类型的数据用另一种clazz结构
        /*   Top ： $.areas[?(@.position.layoutPosition=='Top')].components[0]
           H3 ： $.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='H3')]
           ToolTips ： $.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='ToolTips')]
           ToolBar ： $.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='ToolBar')]
           AssistBar ： $.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='AssistBar')]
           DocumentComponent ： $.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='DocumentComponent')]
           */

        if (localData.componentPath.clazz == 'com.qpp.cgp.domain.product.config.view.builder.config.v3.NamePath') {

        } else {
            var FullPath = {
                "$.areas[?(@.position.layoutPosition=='Top')].components[?(@.name=='Top')]": "$.areas[?(@.position.layoutPosition=='Top')].components[0]",//这个配置是为了处理配置人员已经配置了的大量不兼容数据
                "$.areas[?(@.position.layoutPosition=='Top')].components[?(@.name=='NavBar')]": "$.areas[?(@.position.layoutPosition=='Top')].components[0]",
                /*                "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='H3')]": "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='H3')]",
                                "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='H4')]": "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='H4')]",*/
                "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='ToolTips')]": "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='ToolTips')]",
                "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='ToolBar')]": "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='ToolBar')]",
                "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='AssistBar')]": "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='AssistBar')]",
                "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='DocumentComponent')]": "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='DocumentComponent')]",
                "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='DocumentTop')]": "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='DocumentTop')]",
                "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='DocumentBottom')]": "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='DocumentBottom')]",
                "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='DocumentLeft')]": "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='DocumentLeft')]",
                "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='DocumentRight')]": "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='DocumentRight')]"
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
                    clazz: 'com.qpp.cgp.domain.product.config.view.builder.config.v3.NamePath',
                    name: newName,
                    path: newPath
                }
                localData.componentPath = namePath;
            }
        }
        localData = Ext.Object.merge(localData, {
            navItemId: editViewConfig.navItemId
        });
        editViewComponent.navItemId = editViewConfig.navItemId;
        editViewComponent.componentPath = localData.componentPath;
        editViewComponent.id = localData.configId;
        editViewComponent.config = me.editViewDataTransComp(localData, 'domain', domain);
        return editViewComponent;
    },
})
