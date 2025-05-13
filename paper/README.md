# JOSS Article

- [JOSS Paper Format](https://joss.readthedocs.io/en/latest/paper.html)
- [Example Paper](https://joss.readthedocs.io/en/latest/example_paper.html)
- [Review Criteria](https://joss.readthedocs.io/en/latest/review_criteria.html)
- [Review Checklist](https://joss.readthedocs.io/en/latest/review_checklist.html)

## Generating a PDF

```sh
docker run --rm \
    --volume $PWD/paper:/data \
    --user $(id -u):$(id -g) \
    --env JOURNAL=joss \
    --platform=linux/amd64 \
    openjournals/inara
```
