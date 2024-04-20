export default function listToTree(
  list: {
    [prop: string]: any;
  }[],
  parentFiledName = "replyId",
  subFiledName = "replies"
) {
  const info = list.reduce((map, node) => ((map[node.id] = node), (node[subFiledName] = []), map), {});
  return list.filter(node => {
    info[node[parentFiledName]] && info[node[parentFiledName]][subFiledName].push(node);
    return !node[parentFiledName];
  });
}
