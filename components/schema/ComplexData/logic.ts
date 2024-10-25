import { IJSONSchema, IJsonTree } from "../../../types/schema";

export function dealSchemaArray(
  cur: IJsonTree,
  obj: IJSONSchema,
  openKeys: string[],
  parentKey = ""
) {
  const { items } = obj;
  const myKey = parentKey ? `${parentKey}-ITEMS` : "ITEMS";
  openKeys.push(parentKey);
  const r: IJsonTree = {
    title: "ITEMS",
    key: myKey,
    type: items.type,
    description: items.description,
    children: [],
    required: false,
    indexArr: [...cur.indexArr, 0],
    parent: cur
  };
  const { type: t } = items;
  if (t === "array") {
    dealSchemaArray(r, items, openKeys, myKey);
  } else if (t === "object") {
    const keys = Object.keys(items.properties);
    if (keys.length) {
      dealSchemaTotal(r, items, openKeys, myKey);
    }
  }
  cur.children = [r];
}

export function dealSchemaTotal(
  parent: IJsonTree,
  schema: IJSONSchema,
  openKeys: string[],
  parentKey = ""
) {
  openKeys.push(parent.key);
  Object.keys(schema.properties || {}).forEach((key, index) => {
    const { type, description } = schema.properties[key];
    const myKey = parentKey ? `${parentKey}-${key}` : key;
    const cur: IJsonTree = {
      title: key,
      key: myKey,
      type,
      description,
      children: [],
      required:
        typeof schema.required === "boolean"
          ? schema.required
          : schema.required?.indexOf(key) >= 0,
      indexArr: [...parent.indexArr, index],
      parent
    };
    // 处理object
    if (type === "object") {
      dealSchemaTotal(cur, schema.properties[key], openKeys, myKey);
    } else if (type === "array") {
      dealSchemaArray(cur, schema.properties[key], openKeys, myKey);
    }
    parent.children.push(cur);
  });
}

// 初始化, 以上都是
export function dealSchemaToTree(
  i?: IJSONSchema
): {
  res: IJsonTree[];
  openKeys: string[];
} {
  const openKeys: string[] = [];
  const root: IJsonTree = {
    title: "根节点",
    type: i?.type || "object",
    key: "root",
    description: "",
    children: [],
    indexArr: [],
    required: false
  };
  if (i) {
    if (i.type === "object") {
      dealSchemaTotal(root, i, openKeys, "");
    } else if (i.type === "array") {
      openKeys.push(root.key);
      dealSchemaArray(root, i, openKeys, "");
    }
  }
  return {
    res: [root],
    openKeys
  };
}

// 新增节点
export function addNodeByIndex(
  rootNode: IJsonTree,
  indexArr: number[],
  isChild?: boolean
): number[] {
  const matchNode = findNodeByIndex(rootNode, indexArr);
  const newNode: IJsonTree = {
    title: "",
    type: "string",
    key: "new",
    required: true,
    indexArr: []
  };
  let parent = matchNode.parent;
  if (isChild) {
    parent = matchNode;
  }
  const newIndexArr = [...parent.indexArr, parent.children.length];
  parent.children.push({
    ...newNode,
    key: "new" + newIndexArr.join("-"),
    parent,
    indexArr: newIndexArr
  });
  return newIndexArr;
}

// 切换类型
export function changeNodeType(
  rootNode: IJsonTree,
  indexArr: number[],
  type: string,
  oriType: string
): {
  openKey: string;
  newIndexArr: number[];
} | void {
  const matchNode = findNodeByIndex(rootNode, indexArr);
  matchNode.type = type;
  if (type !== "object" && type !== "array") {
    if (matchNode.children) {
      matchNode.children = [];
    }
  } else {
    const isObject = type === "object";
    const newIndexArr = [...matchNode.indexArr, 0];
    const key = "new" + newIndexArr.join("-");
    const newChild: IJsonTree = {
      title: isObject ? "" : "ITEMS",
      key,
      type: "string",
      required: true,
      description: "",
      indexArr: newIndexArr,
      parent: matchNode
    };
    matchNode.children = [newChild];
    // 聚焦第一个输入框, 如果原来是简单类型, 需要增加一个openKey
    return {
      openKey: ["array", "object"].indexOf(oriType) < 0 ? matchNode.key : "",
      newIndexArr: isObject ? [...newIndexArr, 0] : []
    };
  }
}

// 保存
export function dealTreeToSchema(root: IJsonTree): IJSONSchema {
  const { type, description } = root;
  const res: IJSONSchema = { type, description };
  dealTreeSchemaLoop(root, res);
  return res;
}

function dealTreeSchemaLoop(node: IJsonTree, parSchema: IJSONSchema) {
  // 不一定有property, 如果是array来的就只有items，如果object来的就有property
  if (node?.children?.length) {
    if (node.type === "array") {
      parSchema.items = {};
    } else if (node.type === "object") {
      parSchema.properties = {};
      parSchema.required = [];
    }
    node?.children.forEach(item => {
      const { title, type, required, description } = item;
      const t = title.toLowerCase();
      if (t === "items") {
        parSchema.items = { type, description };
        dealTreeSchemaLoop(item, parSchema.items);
      } else if(t){
        parSchema.properties[t] = { type, description };
        if (required) {
          parSchema.required.push(t);
        }
        dealTreeSchemaLoop(item, parSchema.properties[t]);
      }
    });
  }
}

// 删除节点
export function removeFormTree(indexArr: number[], jsonTree: IJsonTree[]) {
  const lastIndex = indexArr.pop();
  const parent = findNodeByIndex(jsonTree[0], indexArr);
  if (parent.children) {
    parent.children.splice(lastIndex, 1);
  }
  reAdjustOrder(jsonTree[0].children, []);
}

export function findNodeByIndex(
  rootNode: IJsonTree,
  indexArr: number[]
): IJsonTree {
  return indexArr.reduce((r, c) => {
    return r.children ? r.children[c] : r[c];
  }, rootNode);
}

function dealOrderArray(item: IJsonTree, indexArr: number[]) {
  item.indexArr = [...indexArr, 0];
  if (item.type === "object") {
    reAdjustOrder(item.children, item.indexArr);
  } else if (item.type === "array") {
    dealOrderArray(item.children[0], item.indexArr);
  }
}

// 删除之后重新调整顺序 目前是全部重排，可以优化效率，只重排自己下面的和子类
export function reAdjustOrder(treeArr: IJsonTree[], indexArr: number[] = []) {
  treeArr.forEach((i, index) => {
    i.indexArr = [...indexArr, index];
    if (i.type === "object") {
      reAdjustOrder(i.children, i.indexArr);
    } else if (i.type === "array") {
      dealOrderArray(i.children[0], i.indexArr);
    }
  });
}
