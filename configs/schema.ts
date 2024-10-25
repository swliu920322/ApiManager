export const requestMethods = [
	"GET",
	"POST",
	"PUT",
	"DELETE"
].map((i: string) => ({ value: i, label: i }));
export const requestColor = {
	GET: "#17B26A",
	POST: "#F16820",
	PUT: "#2E90FA",
	DELETE: "#F04438"
};
const typeOptions = ["number", "string", "array", "boolean", "integer"];
export const typeSelectOptions = typeOptions.map(i => ({
	value: i,
	label: i
}));
export const allTypeOptions = ["object", ...typeOptions].map(i => ({
	value: i,
	key: i
}));
