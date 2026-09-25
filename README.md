# 페비츄비 PWA

게임은 저장소 루트의 `index.html`에서 제공됩니다. 공개 주소: <https://hy0913-1.github.io/pebichubi/>.

## 배포

GitHub 저장소 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정합니다. `main`에 push하면 `.github/workflows/pages.yml`이 루트의 정적 파일을 GitHub Pages에 배포합니다. Actions의 **Deploy PWA** 실행이 완료된 후 공개 주소로 접속합니다.

## 설치와 저장

iPhone에서는 Safari로 공개 주소에 접속한 뒤 **공유 → 홈 화면에 추가**를 선택합니다. HTTPS 환경에서는 서비스워커가 페이지와 아이콘을 캐시에 저장합니다. 3D 라이브러리 네 개는 처음 접속 시 CDN에서 내려받으며, 네트워크나 CDN 상태에 따라 첫 오프라인 실행 여부가 달라질 수 있습니다.

게임 세이브는 기존 `localStorage` 키를 사용합니다. 같은 공개 주소에서 업데이트하면 저장을 계속 사용하지만, 이전 `file://` 실행이나 다른 호스트의 저장 데이터는 브라우저의 출처 분리로 자동 이전되지 않습니다. 사이트 데이터 또는 홈 화면 앱 데이터를 지우면 해당 데이터도 삭제될 수 있습니다.

로컬 PWA 확인은 프로젝트 루트에서 `python -m http.server 8080`을 실행한 뒤 `http://localhost:8080/`에 접속합니다. `file://`에서는 서비스워커가 작동하지 않습니다.
