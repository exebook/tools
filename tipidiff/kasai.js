public class Kasai {
 
        // � sufArray (s.length() + 1) ��������� � ������� ������ �������
        public static int[] solve(String s, String[] sufArray) {
                int pos[] = new int[s.length() + 1];
                for (int i = 0; i <= s.length(); i++) {
                        pos[i] = s.length() - sufArray[i].length() + 1;
                }
                int rank[] = new int[s.length() + 1];
                for (int i = 0; i <= s.length(); i++) {
                        rank[pos[i]] = i;
                }
                int ans[] = new int[s.length() + 1];
                int h = 0;
                for (int i = 1; i <= s.length(); i++) {
                        if (rank[i] > 1) {
                                int k = pos[rank[i] - 1];
                                while (((i + h - 1) != s.length())
                                                && ((k + h - 1) != s.length())
                                                && (s.charAt(i + h - 1) == s.charAt(k + h - 1)))
                                        h++;
                                ans[rank[i]] = h;
                                if (h > 0)
                                        h--;
                        }
                }
                return ans; // ans[i + 1] = ����� ����������� ������ �������� sufArray[i] � sufArray[i - 1]
        }
}

�������� ����� (������� � ������� � ����� � �� � �����) � ��������, �� �������� ����� ��������� ����� ���������� ����� ��������� (����. lcp, longest common prefix) � ���� ��� ��������� ������ ������, �������� � ������������������ ������� (�.�. � ���� �������� ��������� ����������� �������). ������ ��������� �������� ���� ������ � ���������� ������, ������� � ������ ���� ���������� ����� ���������.

